/*global bindToObject: false, tddjs: false, errorIfOverwrite: false, bindSuffix: false, angular: false, jstestdriver: false, beforeEach: false, afterEach: false, inject: false, andExecuteWith: false, spyOn: false, describe: false, beforeEach: false, inject: false, it: false, expect: false, module: false, : false, app: false, exportCSV: false */
/*jslint newcap: true, white: true, sloppy: true, vars: true, unparam: true */

/**
 * @author Jaran F
 * @description Dependency injection via a proxy-ing object that gets bound to 'this' for the function / method that has stuff injected into it. See https://github.com/jaranF/VanillaJS-Boilerplate_Patterns-Injector
 */

if (!Function.prototype.inject) {
  Function.prototype.inject = function(injectionDefinition) {
    var arrArgsToInject, fnToInjectInto =  this, objInjectedOnto;
    var bindingSuffix = "__", errorIfOverwrite =false;
    var toString = Object.prototype.toString, slice = Array.prototype.slice;

    function iterateBindItems(colThingsToInject, objAttachTo) {
      tddjs.each(colThingsToInject, function(itemKeyName, itemValue) {
        if (toString.call(colThingsToInject) === "[object Array]") {
          iterateBindItems(itemValue, objAttachTo);
        } else {
          var sInjectedItemName = bindingSuffix + itemKeyName;
          if (errorIfOverwrite && typeof objAttachTo[sInjectedItemName] !== "undefined") { //tddjs.isOwnProperty(objAttachTo, bindingSuffix + itemKeyName)
            throw new Error("Injected item would overwrite an existing property");
          } else {
            objAttachTo[sInjectedItemName] = itemValue;
          }
        }
      });
    }

    if (toString.call(injectionDefinition) === "[object Object]" && injectionDefinition.bindToObject) {
      objInjectedOnto = Object.create(injectionDefinition.bindToObject);
      errorIfOverwrite = !!injectionDefinition.errorIfOverwrite;
      bindingSuffix = typeof injectionDefinition.bindingSuffix !== "undefined" ? injectionDefinition.bindingSuffix : bindingSuffix;
      arrArgsToInject = slice.call(arguments, 1);
    }
    else {
      objInjectedOnto = {};
      arrArgsToInject = slice.call(arguments, 0);
    }
    iterateBindItems(arrArgsToInject, objInjectedOnto);
    return {
      andExecuteWith: function() {
        //inline direct params are received as args as per usual. i.e. the arguments object.
        return fnToInjectInto.apply(objInjectedOnto, slice.call(arguments, 0));
      }
    };
  };

}