import {
  LOAD_ERROR,
  NOT_BOOTSTRAPPED,
  LOADING_SOURCE_CODE,
  SKIP_BECAUSE_BROKEN,
  NOT_LOADED,
  objectType,
  toName,
} from "../applications/app.helpers.js";
import { ensureValidAppTimeouts } from "../applications/timeouts.js";
import {
  handleAppError,
  formatErrorMessage,
} from "../applications/app-errors.js";
import {
  flattenFnArray,
  smellsLikeAPromise,
  validLifecycleFn,
} from "./lifecycle.helpers.js";
import { getProps } from "./prop.helpers.js";
import { assign } from "../utils/assign.js";

/**
 * 通过微任务加载子应用，其实singleSpa中很多地方都用了微任务
 * 这里最终是return了一个promise出行，在注册了加载子应用的微任务
 * 概括起来就是：
 *  更改app.status为LOAD_SOURCE_CODE => NOT_BOOTSTRAP，当然还有可能是LOAD_ERROR
 *  执行加载函数，并将props传递给加载函数，给用户处理props的一个机会,因为这个props是一个完备的props
 *  验证加载函数的执行结果，必须为promise，且加载函数内部必须return一个对象
 *  这个对象是子应用的，对象中必须包括各个必须的生命周期函数
 *  然后将生命周期方法通过一个函数包裹并挂载到app对象上
 *  app加载完成，删除app.loadPromise
 * @param {*} app 
 */
export function toLoadPromise(app) {
  return Promise.resolve().then(() => {
    // 说明app已经在被加载
    if (app.loadPromise) {
      return app.loadPromise;
    }

    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return app;
    }

    app.status = LOADING_SOURCE_CODE;

    let appOpts, isUserErr;

    // 将返回的一个接收状态的Promise，其值为app传递给app.loadPromise，返回出去
    return (app.loadPromise = Promise.resolve()
      .then(() => {
        // 获取传递给子应用的props，怎么传递？（其实这里没有传递，在后面通过生命周期传递）
        // loadApp()即registerApplication传入的app，之前处理时转成了function
        // 之前处理loadApp为return () => Promise.resolve(loadApp); 这里相当于执行该函数，将loadApp变成了一个Promise对象
        const loadPromise = app.loadApp(getProps(app));
        // 判断loadApp函数是否返回promise
        if (!smellsLikeAPromise(loadPromise)) {
          // The name of the app will be prepended to this error message inside of the handleAppError function
          isUserErr = true;
          throw Error(
            formatErrorMessage(
              33,
              __DEV__ &&
                `single-spa loading function did not return a promise. Check the second argument to registerApplication('${toName(
                  app
                )}', loadingFunction, activityFunction)`,
              toName(app)
            )
          );
        }
        // val是什么？就是registerApplication()传入的app
        // return了一个接收状态的Promise，其值为app
        return loadPromise.then((val) => {
          app.loadErrorTime = null;

          appOpts = val;

          let validationErrMessage, validationErrCode;

          if (typeof appOpts !== "object") {
            validationErrCode = 34;
            if (__DEV__) {
              validationErrMessage = `does not export anything`;
            }
          }
          
          // 必须导出bootstrap,mount,unmount方法
          if (
            // ES Modules don't have the Object prototype
            Object.prototype.hasOwnProperty.call(appOpts, "bootstrap") &&
            !validLifecycleFn(appOpts.bootstrap)
          ) {
            validationErrCode = 35;
            if (__DEV__) {
              validationErrMessage = `does not export a valid bootstrap function or array of functions`;
            }
          }

          if (!validLifecycleFn(appOpts.mount)) {
            validationErrCode = 36;
            if (__DEV__) {
              validationErrMessage = `does not export a mount function or array of functions`;
            }
          }

          if (!validLifecycleFn(appOpts.unmount)) {
            validationErrCode = 37;
            if (__DEV__) {
              validationErrMessage = `does not export a unmount function or array of functions`;
            }
          }

          // 判断是app还是parcel
          const type = objectType(appOpts);

          // 说明上述验证失败，抛出错误提示信息
          if (validationErrCode) {
            let appOptsStr;
            try {
              appOptsStr = JSON.stringify(appOpts);
            } catch {}
            console.error(
              formatErrorMessage(
                validationErrCode,
                __DEV__ &&
                  `The loading function for single-spa ${type} '${toName(
                    app
                  )}' resolved with the following, which does not have bootstrap, mount, and unmount functions`,
                type,
                toName(app),
                appOptsStr
              ),
              appOpts
            );
            handleAppError(validationErrMessage, app, SKIP_BECAUSE_BROKEN);
            return app;
          }

          if (appOpts.devtools && appOpts.devtools.overlays) {
            app.devtools.overlays = assign(
              {},
              app.devtools.overlays,
              appOpts.devtools.overlays
            );
          }

          app.status = NOT_BOOTSTRAPPED;
          // 在app对象上挂载生命周期方法，每个方法都接收一个props作为参数，方法内部执行子应用导出的生命周期函数，并确保生命周期函数返回一个promise
          app.bootstrap = flattenFnArray(appOpts, "bootstrap");
          app.mount = flattenFnArray(appOpts, "mount");
          app.unmount = flattenFnArray(appOpts, "unmount");
          app.unload = flattenFnArray(appOpts, "unload");
          app.timeouts = ensureValidAppTimeouts(appOpts.timeouts);

          delete app.loadPromise;

          return app;
        });
      })
      .catch((err) => {
        delete app.loadPromise;

        let newStatus;
        if (isUserErr) {
          newStatus = SKIP_BECAUSE_BROKEN;
        } else {
          newStatus = LOAD_ERROR;
          app.loadErrorTime = new Date().getTime();
        }
        handleAppError(err, app, newStatus);

        return app;
      }));
  });
}
