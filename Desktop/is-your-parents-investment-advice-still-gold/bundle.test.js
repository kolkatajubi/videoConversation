(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a;
                } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r]; return o(n || r);
                }, p, p.exports, r, e, n, t);
            } return n[i].exports;
        } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]); return o;
    } return r;
})()({
    1: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() { }

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
            return [];
        };

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
    }, {}], 2: [function (require, module, exports) {
        (function () {
            //require
            // let BayesClassifier = require('bayes-classifier')
            let bm25 = require('wink-bm25-text-search');
            let nlp = require('wink-nlp-utils');
            let tokenizer = require('string-tokenizer');
            let SentenceTokenizer = require('sentence-tokenizer');
            let stringSimilarity = require('string-similarity');
            let sentTokenizer = new SentenceTokenizer('webBot');
            let chatArray = [];
            let online = true;
            let tags = {};
            let currentButtonContext = {};
            let deviceInfo = {
                display: {
                    width: window.screen.width,
                    height: window.screen.height,
                    availWidth: window.screen.availWidth,
                    availHeight: window.screen.availHeight,
                    colorDepth: window.screen.colorDepth,
                    pixelDepth: window.screen.pixelDepth
                },
                inputType: "text",
                // location:{},
                connectionType: {},
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            function getTime() {
                let d = new Date();
                let hours = d.getHours();
                let ampm = hours >= 12 ? 'pm' : 'am';
                if (hours > 12) {
                    hours = hours - 12;
                }
                let minutes = d.getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                return { hours: hours, minutes: minutes, ampm: ampm };
            }

            function utmExtractor(sender) {
                if (sender && sender.includes("-") && !tags.utmExtraction) {
                    let keyValues = sender.split("-");
                    keyValues.map(element => {
                        if (element && element.includes(".") && element.split(".").length == 2) {
                            tags[element.split(".")[0]] = element.split(".")[1];
                        }
                        return "invalid";
                    });
                    tags.utmExtraction = true;
                }
            }
            // if ('geolocation' in navigator) {
            //     navigator.geolocation.getCurrentPosition(function (location) {
            //         appendLocation(location, 'fetched');
            //     });
            //     navigator.geolocation.watchPosition(appendLocation);
            //     function appendLocation(location, verb) {
            //         // console.log("Location Fetched")
            //         deviceInfo.location=location
            //         deviceInfo.location.verbResponse = verb || 'updated';
            //     }
            // } 

            function getNavConnection() {
                return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
            }
            let info = getNavConnection();
            if (info) {
                info.addEventListener('change', updateNetworkInfo);
                updateNetworkInfo(info);
            }

            function updateNetworkInfo(info) {
                deviceInfo.connectionType = {
                    type: info.type,
                    effectiveType: info.effectiveType,
                    downlinkMax: info.downlinkMax
                };
            }

            let Crypt = function (passphrase) {
                let pass = passphrase;
                let CryptoJSAesJson = {
                    parse: function (jsonStr) {
                        let j = JSON.parse(jsonStr);
                        let cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
                        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
                        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
                        return cipherParams;
                    },
                    stringify: function (cipherParams) {
                        let j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
                        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                        if (cipherParams.salt) j.s = cipherParams.salt.toString();
                        return JSON.stringify(j);
                    }
                };

                return {
                    decrypt: function (data) {
                        return JSON.parse(CryptoJS.AES.decrypt(data, pass, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
                    },
                    encrypt: function (data) {
                        return CryptoJS.AES.encrypt(JSON.stringify(data), pass, { format: CryptoJSAesJson }).toString();
                    }
                };
            };

     //------start------
        //------CODE------
        let passphrase = '33a141f9-5f09-3667-8939-facc4d71e70a';
        let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
        let intents={"ct":"Zy4BX2FFPPB8VLt4ngMSfmuUPZLiDFlS/htjNrKqGly6aeVguqHjaM8Fe+GCmooMFBu5nw+3B5vsJvaxDI25avXXuKxa3XiPogC438djNfSYajK6rxDPZZyXNGPpKEaMe1As8EKbgW5YqfrLohi3vwxLxTW/0TEwchugvpyOVOSudBTwTKp4pzyqNAR6PS1aVNkLV4JpczllIUq/vuWmJBcRtmJAX1ULqTfzHClYW1UB6PZX2wYLpinb6jTn+mb2qccyhfYBMhaIKqdAjOaJESp87wpRxjn/YEAw+2sh5UJJDBd7WY+ZZe4RT71Z7QptNxxGv0cywsmA3HBHl5hQRsn+mAjICMn/Vu+OERS/iPKxfo+aCOscEFbGG6CnZQYoUcTztKjqn0wW2rX0wdxNfbAp40oXlpabNiYhr3PyUBUfvnUXOz95TbWWDnhedJ3vRdKWzDjlEKPzYxwvPa+kVT0HYahFWldccUNUJYalhF4qYkIMSSzRDC0y2gjnUWAqal0zM0lenWAyYkyKZlAhtya2g4469Y8sWHW/wsnYmp9QyzQQ9UgtUd68q8xdlgkwFsA3rS6Fw3jfCMQ0HUAnO6szkX4SnrBTOocArydQ+zGQy0bQ4WldMOfFJazI5KvuaTeX2U26Ikw/GIlT5knfcyePFVxYo4ETKD2xSs+a1SUqR6gwrnboJH9OQcw7xRz6e+dwUbFKhc0aCMetVC0wHMtgz+k28EQ7Uyzr/9MnaJK8fWVBC82xBkzuH6NwgHUCXgiER7iZuZ4XMGx9W7tyGBFhtBaWuuhS9FbRO1Y4Adfodn8OLxKE/vYMT1RbrDSQgIyKFfmvhyPgNkvunuEBcfgyxmJ2LMSY/PnJr86aXKl9+vXrgYr9EROmYGC7Il/mQTWDu3tMZcuFLKYsqKFUogwYpLS9J61wV3WfxLwogKlI0O/E/Atu5FtHgA/SB0lYlZp7X3xETBQ3SZ3UreUpkCNdeoRKn3b9Y+gjenUa+3NcUjEcEkYaXwTrfeMxWidYgs3Z5v6s2BqrT6VX6BLXKb7CwkgJDBpk2RekdO8v1E+hxhhIjgtCbqhvpSkcMw+G7kNnxG2Ty4TxNovHrnCC4l/DLr68JxBvDEKq7/3TIsNrp0DXTit9LJ4SuuWQSbnaH0X4JYEUYmyC90FAEZ3Cae/DLOUGIsCIfOYKYqcdAVo3fbGM5WWFXrdI3DzyQ4Ys2Ud53NnF4BnBWNrjcjf4+dEHK/3w/0Btq9fWkhGeWMhIBqc5mGgaPDqDWrrrdkIvqYhW0sGuzbVrt4rEnFcqcWuauU8DFALTzMiwFOb7jNdUMry6d+Bs3mhERCA5FYAQa7U88KC2E1XvB8J4c2HhCmIcQXzQzFMl9I/CaZCy3u/2jdaJaLLTuIhLxry2v234Oot3WJggh/VX/ZxOIhkOKoaS7/Gbv7mqyGmfflMIQiM25cHu3Od8F2zep8OWPerc4X9B+WQSivy7XV/GIqR1TDg9hWCI9WZLVslLeXMa8vEqC4Il+UlDvppCZ6zlOlBdjhiTI1J+xXH2tjsseQBRf/nHQ/WoKrTuoSeLbgyUFnAqTrAhfpSdrQ538JhfuS5TIz2mRDcLEnTnQUNnj6HvhBMCYLFI4nskZsIrjgEQ1UmigYbaaw94CgfJEpqz+uh0Sfg42wGgJEwtsrGEgjo2be9QmKHiiwhzj1mXC7VXI2/eyM9VeY7cySRvU8KAZZkp4MlTn37iFSXZ54IytRgpJJ71nMCjsoAS7Y2hFLdQMZuEg3cRTmtreMSFUdBHR33uHvmCR71AMwinhBqfdJVEIc+y+LJo+oXNYc0WiKXGuTKZFGSKU0WWmGV9/WrhnnqU/XNJ7FlNEOrjlXQpoFQOtV4FE1XWvLoCgBdB/m8guawvNPnNi/BZOp8iH3PaaScqs5TP5arD8M6Mpoyox9z9HWCszGlVVWWdPCGROxf2zZ0Qn5m02wtRUaFouQaEuFmMcHvg3yxXSVEZRDoiXwIHusgHMBioTne9BC+QgzmU4pNm1zjiVl7UbwNxOII7wmem2lpNzi6x+9btDpMKkDLNUl1yeRtJMpIb2sHoSligmhUQWAcGWvf1L8p7MwmmsXvPVG0fJ8lsa31oCx4QaqGwKxzDkXVd+TwYizcEcf6UFN9FiCzsmbav+HdTJJ/MDHNSaDojCYPkhAVgDrWzqtSNFJfnRqPZTQXWswZBVVXGi5AJP6nZ8hraoBQapUzfMSOS9h/Bb+Wvg0KTCaApAeIJlPxsArxcLYYYa6MwgFk+5fVebu0q0pHdUXmjj0w47r4a7L3APWM7ZL1Vsu7211xOKZsLCuGe/7AYK/CqOkoKXqbnmAPpIYD/fo8souIxaY4yyQGbRQ/WO1eGlYMTaYuOyt8aa4D28+VThBUc/BEHhXjamoKcOkQLTi+tLUw9lKblVWXMV7IBlGDrwdCl5Ddx3yiNL10xg5ARzao/1KnBvtwr38lsMao84culkbQ/p+w0Fm/xA08Ip6QLuGRsV3KCQ75l4ODb/HvQcLIuCoxSrdhM0B8rfbLAXWo6ijW0DmYB5HaNixF3K6nC17TmelzGChHHABk8WNCX7JeVWFc5EoZ0Antp3pC6ghRdSAys/FlAeG1up1y+sqAs9EwTSgNQEvBD9Qf7SsxYv1sFPkBLN5N7vD0DgX62mD6ov/DaT62CUMg7amAgqZ9x2xOZzP/7ZsALXs5nPk4pEbdAUJVteawfvV3AQmOhzMrM0A/0wUhPUVsKjUpkpXPERSSnFKH3+KTwJTNkPmcrxH2cHJzkpCIJYpaFnoWjL8p0yTxM03p8LFRsuNEM2fQzmX4r6WeD8fTdHQ0RSHVW4frJtzHwG8QCjkr2EfFcZON7YzcqukJSIcQpG2CuXNr0vJmU3nkpV1PZeJDo0jLH13TSkg69tBqiE90/FC3BLYll2WwxyJ5XX0Xz/4vQboSZ64L+/cBGcNF7USF1VWmQU7sUMzZ48NCZEpPk9jHfyollfOwfAA8ebJsE/Gx+paUi8gl0BnOMLHuFqN/3zw/lblZpwKdVuN961rkJzS8pmo1XHC2XHsSLbkYCpzaEpoB4njf5F5gZyCcCaWUvhDZ5hh1QgDgbYPyr3GGrOjuLdjPz4OyFOeC1dEJ+WUvUM3xkMPTknnVElE6g4FHxqulfmXGLZL6xeysHk0eoVbbTjCaw/VLt3F/Zu2U5G5HevBMmgTLXOg3F0u6nkbC16olV0+nJC9oexKVVITVTO0IkQeGo+pHcNq6YLgyHuVhKekt2buVCovMyuPT76OtRgLboCem8MPmMXSrdUPTHfmAyw+Hf5JJAlAp0+ebk3H7Co9JJD+y0T4ehEufZQ78aoojmyCh+ePkzD73FaXMLdO1uRMk4ktlAiwMlU/BNTpACc2ZtJNUCIXTtu8X8bD8fP0zLxduovO0acxkJIY03IQb9ZHLubKLfBE6m/j3GKeMOCKYVsFpTetPYN6BQSdyZZQXsB8n3ckiYc76eg3d+ZIoLUZqC1+pUALa15itR9yAnSsF6BL7srYYHpoleMcMnnT3ZrPu4TheyHkn5c/i2HppGOofVCvJgZroLQXdAr61QTVyXzoKTdMU7qRilqvF0cuOvY/CKx/OjJ+Ff/qprXDPKs4Bt+PlwpkcfPeIOvQ9gveQe/M39rn5sOK+v51ZjQvMqKzu57ld+K6LBN8EneBRFK1EAIs2eTaTTiWiu9cBu2A0tvJRFPTpAIHe3hNQO5Gc7e/RtJxH/aePFsROf5G/Am/SaRu15zeYTqHoRE2QBXiW6ys8lb6Qo8R+Enbq9b7IRMST5npfFq8p3EIlN/C+ggzX69vN1CYJBQURaRKYG/4EOf4WSAE77u1MDuSfCCUYjBBMBoOtXx4IRzO/D7IU2PATsk1WMoJcZSnI+EHcr/jus4z/8B4pXTD7MclpzjMMxGoXqJaqOa/DfAJhdJH0bF3YcEy1z4e5Zs0vPm2wYJVeHud4ZER1Au5pmLea1A+gBc6IkWZFWB5iPGhW3GTpzT5Mm+8FkblKaHX0n5iecD9cTaIQXQ717Tta0qo+q3cGnKgTp73QONFeZH19dvK9nZKWcL3F2hei2RbTtBArSDD27VFasLtXEs+2hbnGKSp9AfgjMXA2dUQBljp6Lxrc5ApFZ79QEPVltjntkoXgCtfW+C7j7Qry1UZ+vjTXWEMWVjQIYwy6tsfQ8h4MfNSgOyGJ+5oplAxaVL/QjQeEmG7oiOYUDh0QaUGRIkU8uRfiw07oXgDfxSJPrOGr6111NEQuLe9cmGOENEMnRXIkYhpzPHvz7pFoVVOoEG6Ss39THLy6PYM7DpIAeI08kbehOZjp/mtE+pt0YlbbVMOGAsqWCF3lbwlZPLGS93kbXxTqeQFNlWEiQNYR9p2hdnFI2s1CKaKHHxAoI8XkdgN1rjHwrK97UyeozE+vVJraAGPCfxkSb6ir5nLC4WYXn0DgkfLjDSuQ6EwymtlbtXrClFL1CFY6k9ZBrHfa63UnOnYFQQpNOVqZ4PuJkLt/UOoADVpaJ2fdI1C96oENbtvNlArEO+af7CwOB7IFaJHkZQx1kvG6MdHgwB84nYH2qCom4yy6H2VRYqRjbUU5qRxmDz00ln1f0mjJfOK39T6rJm1t6e/vhw15cOFRnCUeCjxxMeL5d6/bwyESdlS0LoA5+E1Dy2g1JObgRppCGIx5/T4gDX78iYELp0zimQjRb2Wj2T3dRdZcPyv/UaXfIAw1tJ0ZM3bh8EqizqyX0eFM0kWmnVWriKyMMNgDWH44wp6nBpXMGoFVHyZSiNzMiawhI5Mrx8KSOXmb45JATra9FDjzxtiC0UvJ+Reo5kVLzIkl5r+QNBO/8Yo5CSArNrowvGrkPdkF6zReIVqXtiQkkjm2y+W7BZFYaYOtm1qpR8+Ecoou6f4BjsTHo6d7v9wHxQhailaf6pWa4c+yOgu5XPQU2ixOopIiggeryWh43Mvnej9WdnlRrcSNPeoWqJSZrh1kI12sWHuWIJe8c0Tuk3WXqO0RlyNlLFkXcS4EOLJlHpW4xbJXPnyDcUdGXNmkvio8568L1XHRyBOeRzG2E2t6ieFIBMe2iBCJOC2lZCqPbgHKh3arjPb5iMW/L0/LKTqXe+47cMrA/5csjDTte5pVFdn3cPuoWbo5RKR+358q9Q7Eho9icSaU/HWpArRAzDjenFlOwsD1JQqvu/IFCoWZw02YQlEYgUGTLMErS3f2Lm/pLvnhuaJXz3QQfih5o4UcxwvAoOkf9RjPmZO7HZ7cxUUdJS/9jczsABcIgMGQlkLLB1mU6IX/baSXk8fQPJR6HN57J3sX+SBN/yiN8+iWV7E46LC5UAYtHCmXfZbfTNkdlD2DSYREVNAwfTzo2oGAnk8tqRvX7AhA+Qh5GBxzKB7oxRB3w9nELdWN63L32saa6Q6vocACA7f66Yvg1OA1kwalTrc1hfXdIbq4H2s4SwjId1Lba/FlMMbFjNfJTAXK3rCx+8YsaUcntrPlLi6pN91008HIqq3UPmti24MWBc/HvJ4ZWwqZodWQ8AYbW1YgDt0rcevAtn/mJ1wkRonLyD8Y9dYEo+FMc0rriyrm24mwSD8XMB6tCX/JZrNJoOzFhSrFEbxMUn5iRdbmDUwsOqcuR+cP+7eH3hhZF1RDITty6rSbyjlj4uqCEiivu7XeP8hBepe4LCD53nZJeG5HlN9JZ/rN2mEMDemkWRFKn20TvXajrd/K64YJzF0tg0hNqyVbjUMNNXLMRnqMK8SBR1phDQ/rigKhgcd2qNNPCzS/h9iLrqFoLuSaNy70F9Zjj5sc0Sg4KZqg5CwW3XFjsToNewQEuAYGgLAjMYZT+1+dozXB5oNhB8OWGwntXMPy33EWa1I7B0ShkklZHey4q8Mk2MiyVfLl9mPECcpPH/enBvM0pbN/JO2z3VPpwavfLfpqIMtxrKDt5v1Ta+u8mpKMSSlVDmtGKtgD9VJZTvx00qLVfQ1+PbQkR/StcKBdAGBj+cpBBVCW73/cl5WyANjvYJtyk2an4n3B0fRspaL/L5qLQvAqoyeB81BRFb2QoJ0B0G0Oi07ZacIrFF3y1B9oUViMsN/OuQFt4W8UuarXMkMJQO4fhFYx4GURPonYuGukeI5drke9zrrM72zSEl74+LoF0ZGHqfeEvDvRvig1XxsUZT6whTxE8RhpMPmmYPfsw4RxCjO6RDF5TBr2dWKajwf5k7Dcbi2d2+yT1691uC+abMB124JGB47qBYIc0rbNUtSxdFUOl0OnO3bpAHxusmi4Q8q6CwsSSkrhBvs0gqSIL6fcxwLBh+Nlu1jHyW0Lq5BzEJpprCGhcEPAi6y82wvsjSZHMubqGeBVbxLHcXTmw3q31/xjlKlkpo5UXCfHJwr/sR/uAL7fjaQPWzB+DtnOOSZz+LqeXvXOgWRrZCA54/zPfwShZdRbg+QaPQlpgq+8ZH8qxnq1teYz4iEUc0PaRQI8SaRm+vHsHDpXq30C9R6tf3zOnIRn+Ffmk+CjSOuiOhPOT2N4zZOH32hz0OmUO2ZdLjUFs9UrunbdPKMvKYNm1dUtFH2RNPOlMitPabpVChuRIv54YFg/DIXNJp2tQ9vkyB4nJWppYsVtkh3NU8EjKRMRc/xaYXebDRODSTxuUowPA/24kucMNZ41ZG58oo+pUDWxqQvjAXuS8J0KpsEkiHr/V0j/zkSAIIFnLNCwf9Mwheqn1gZpzHd0rD3dEITzy+Gsa9OCLQDJLR9YPgPg5G2BZMUWgLXQUT+ipRdNqr8ZYw7lDhE6KbK651rIwAAYXy7ODh2RRF7e4C9r6f3tcmQlfSowzS8XlkBedXsb0rtj+9zJeapEGDUrOlPcRbeokwBAoka53uRqN/8U/cY6yg+8XZeLfjc18/9n7Tphj/iJgw2NkKDOlDhuZUEGzsBRw4SRiVoi5aiGsBMenv7h4iUsvqMLmSy2VyuPblpacXOdHk2hJfyRRR1RT8/oSLen4lkzPSb9EN2MQTJtrp95cYzZm/1qiwfzBypy/5qzU3QnIfZ8PtYBilWVUeDIzZr8biuIulJA6bAH3Z4bMoL6eSljTckE0tMurmyJMiShHrfILJe378bXT960q/z5xWBs8FBhglpSWI49i+DQvXsXexlcTfHQhauVptn+LnRZ/D91TYCLLmiT3PJi2HqCHJgNficChPaNFbO0zlzpWwpY4VbNBQ5K6t6DKsInEkLqfItVN7lKkzRVpaTCAXQrACA7lR3yYAgTi+nFY3IHd4KKW0NtDgEq4ukp/d9IcmShsvlX2nybTzfkP7irOElZUxGxWfSpdGQr3yIq1RodOTOpJWzDX8L55SuBUZH/N/+2BNEyIwHh/pF8tYHxZqHABMlxe9kZ4pJ21M3+LOMZ6bRHYv0Udl5K/HsnbS7vYykAR89c76xtLInQmhAB4jbzhkrfJSPrL1ciIHIqmm7DbE1xh4paAJpJw8tTGX47/qIfU62MJBLsu0GZ8Fz69X564GsLNA3/bcJsggJW10TJnVv+y3QmPkpDj1tUqns0SwlYJxsEJopw8DynbTYXngOfxa5JYxeRUNxVpO1Dl2Xk4m1eUhZCa63N4FjRUaXP4Qn5cNgbfZ2IBKGiCCVjzovrYCi7WuE6axIZTTK5Qku7NitiZICiMemhB/6kDAXen0+Xcs3Bw5cxauelovDohFQkk+WPJaSfO3BRdbEfe0Bj4vRAiiQYFWfAte+Y4Yf0nU/vqrvpe3/RfQojuFpA6b6GVJRNr/fVK7KpcWpCnnpf4b+ah5n6ea7j4mtJpVi/hYvXmyc7SGd5T8NYasGvVJIfWXCXcN7LYzyrgdTRutvokiYY5pYJvHALxeA0bl0B+GGoKto5TzQLe6riBOFvd9izQuZM1Am2oUFFz3g2aCAXse6juCW5ysyXUADJaASYoafeQCsiWBLC2notg0Vo52gb1Kg6TOzXZVTmaU0RcwyO6imGmsTfPdYGkT4kbqALKd4BknWT05ITjxwpMV9iztudJBF1QZkP1wtdsGdh5TaRZwD+YoIoxPuYqdIZrcso9P7egrGSxZeGyp/i+NCcwsmgK87IdvwvVwBnoUbMA69utggM8FhlF6Qp4aFxIIKWOksVnf+RNm1oF5bmhr3DVaNXGGYcYfGAcsPzYvCcY97suMtaiV+iLligM6AhoNlLJBxbOmb6XSFR2RUPpX7JdIAhUsP0h+/CtI24tWYKVZ04ZotGSR8oxOzZ3jucWSnDF6AQft37oUrVDjMV0ZvDbmcGlbsjLrEanBVS9aoYswyKCtnF2wQTf/MO4/IiSN6W5LXuzby+6S1a+NKJAd5ADx5fQxArZPyct8p3vKp+wR9aLrVlQcmbJXm7c0J3uM/FF2dLeYRC9mwNuxHWiO9hFdzR59e1ZfvFUwchYOl+FfKxGIFWnNzjBJraoH+N0JonaMdsuVlD65/TfahRw4fOLJkle3lVGeDFABEIcO+GdoRQV3w1u1Pr+Mt3P3t53o6rKop7QlII6Hksx1Azw1K9fMa3/+9BskRRbZF6mWMmixE0tD8YjJyMTwzlQ4icDxxxwAORRR/LHW5bRqx2iIvaPBpv7QF65GxpC7WhZ4b1W8POVGOAGdASL2AOzSWGosr7Jspa7tRU1LdHT54Gr7HaQMwmevCnCTxvALi73yhlqa+/SvojIE66q/zjLOh5v4RA6zqOkd70RhVs8UVPQrvsmd9Ervzgbx8mO/D/C62gCIiEQBoxhfpy++lOB/Yzjg3ffwagtex4slD2NBeRcLP6FQkw6eZdM8fe//ICXDq855tZOf3fNUohRGOJa6djyLGLMWr7wHJ9QIBwS2MKkO++pGrFR4u/lhH8SIL1gtpVUBrvFMQLUyhnLe8Rp/U8nnqj2UNUq6hUKQXBCh9F53qJDGyNOZHdvpsX7jFOeffCcCIIP1ILlfBEXonrzskVQBPGrHIZvfl8W+bQ6x9WQ8++nkIG4Rei+ATevNFvhTEsRTOfgCPPPmbJ4ZLgo3VnTW6eZS/JSGUja1n2pI+aosFI959FHPLpS9k4+oVfgcL2qAp+hxW+/L2Jdgs6vZn2TWKEQ3BsKwU4pywrXo+3V6oiXwtcIcRBB7bSlhldCwmnBqXmH/GKHMjKVt2MvXm45mlb+NLFMQoR/0GC8+d+1PzBncJ8ls37QV3rG66hCiCdnvfrSIs8U15Rl5N8UYL4KnfaMFtZQoBZGtPoj/eLVeIg3aD7Hd/uRIzhIu8D1N9qxuos5zTqrY+rqxOUi4Ow2Q40QoZ5OsBgTHVDdxpIKQIX6U+Sjhqs3qVWZjYPHU4Dl7Uuxu13CxgODUlaLykPhFNoelF4rENDhTpITgPtQHgyjx9qC7ow9iZutTipC+d7/OZV5wtNIdXXehU7Hwf+hzUyfekHpndLIAhVFc3+IaExpk+3KxHBhK5/smNTT/JotmXjkL4Z0J3F9hrkG8FhQ4nfX0zZoRLK4rc/2xTwpBWZnVMAw82PX0h5dZshOzLKy03LFicDGJaFu2vkU0F83qfSnoHFEUYF557/gC51YPwKfz9SMXB/DHSY28ItkyrwhoP9++MEKMafcryF7TbCeHu1MXRd5fLW9hZlH4NmyjmXs/lu3+NQWGFtG1LDPACNINSp6ccEAco9SJJDOJzYOmeLKPdiIj2TUaGVHRp9hWleKvb203Bp0x0fJCOjOxUxImbnkCHYc1wkjHJlXZuXbYV3+WZ+Sggp6rKPmNRtSlkAdOiYSQpMJ9jA7HGThnMEJvF8PB/OsVxonpuz/GGBCHThSQ5Rbm6ZpEDHUox+UzqhE17/yApP5AjZE04Qvu6wqoR27s/vIZlTiPjLZLbf8V+YIYZeohYp+JUUW8jI/NefkIc1Y2J8Fipo9hG/XeTpKsKHjt/VPDlDY4Bz4CzGEldRwGq9FZUACLYJ3zR8xQBN2w3kDXy1N5MrTKW15eKYZ4H5AmlTYm+Tgviglrm2gIyYeeubf6LCC8709mYqfH4bojywAN+C7ciC788how3Iabec0jPdv4AWzQnDs0R8KzF64+zQK7Ou7bFkrkixwVzrghBpbW20DzCEVD+ZOqif6nczWEM2biTJYoy+/JaTeLl7rL6va3DpBZXO7MJKBGj1DvYmmt9KMVLtwmmGwmGcandJ0pKIHfdDyePWGHCsJH0dtYyUKUiZDVKxbBuCcy1cyHXCTB8M/xLCXts8aChuUX5aL+wftGL8wsj4WsA+fdL14Qh2bVxRxwDUSCNCT7bfBkyTQ2U451PWNFtxb68ViJgIdO4dHuAC1Xw2AZ74sjdOTKLjc9X9OPnYoRCUDciq1LV9b5NMn9mD5e6brjdq32X1Jx9RZ5uC1Y9UCHRo0HlYzdhLDoJUfrKgtceblHPRHq8iVTABxG4ANngPPLNuVgM94EmeVHUfANdBehhDmZdo9HUG017TCigcHllFobIxwARWol8pnZh7xpEDxSPOZNe9SQF+ekfB1dqbr+BL5cO4gLfBwi9xP8AmScIxSNZlurJWelpu0Jp/q/mgBTmjvI986YC0y12XdIpbkkCl917Rypuku0AvUvC1cPr/6DveLzwAYSYqpV/Ydvx3RVWImbM8qWhv3HXeTpYngORLlgg3wHSHEeelyZhba4EVrMu0HmT9b3Jg/dYZiAvgmVGJe7GWNP1TyxXvtkTNF7toBxOyADB6jQc8oSb2O7pQmVloLB/h4anzesiBz1d2FXdJbF0mUE+qXOzAOemzqSy3+uF4qjEiuSB/wimATr08e2vJTQECU2Ew5dx8RuY+efzp2PNC2g+C00EdOnTS1jmiqkNx41U+NYFJ25GfvR8ZojnLCFImTgmkEaNzdHlWrQZg58bKnS1MH9vlHSudy2Ejia9T07M72nmUBOd+m5oo9GCLS3AIr+1pkjr6LxdObqYkfme8H//u4qNzMUdBm51S6a6Fhg/jthVcja5Fdjf2GXItU5PfCuJRm7aJJQKOGg3pD0TY1hhLAPJYF/yoalXN/bdkTs80wvcUFg9YZ5wxSDI37L4qMIMThdsM1nykf4xMZnnGe8wxibRhBZjYct7iPkdNqPN0CVVp6HGkzpupWQwrjlmHmwF03INl4onSVD4EWX/yfdMB+b2pD+f9apHVIpTeldGPVOQqsJf3BQ712DhRG9eNZNjft2UoYTpL+lO1QejOOVlNdFKe/gorki5bojnsiUlYS7yrXA7ILDm0/mNOxJBGVYyTL3GSjpNx1jC5MJkA1Wa1zX8BtbJVnAb6ibNZeb3ypuSLx1qwQ3VSSExH0h3H4fGuw0oh5enHoHmU/Wi0ZpOX7OBM/OhoBzWhueDsJadt6k9EG/Is+Fa1Y9gOO09r/66utyLlJZOBe9EmyK5twM+wCuvx4zqUpXMobk6Z+IXawLaruL3gOY+WTG7nYdi6IX+rkGXuX7zjJZfbBSGw4krn5Ttg/y71vxI/bvyLLciZ6jyKwaTVKOc0jYvfMG5qBltz5xDIBTOn79XsbtgZImscVfqDgreEYCEVZWW85xfvfNSKVIYlK2v/XPHu5c0JZSJEMxBk4ixzz8boaRgNqb3D4R4xEJnhJNMbbDHibw8TSLNITM2S1875wJmmTHBKTGE/dBwHiRpWFmdydpnbX93W9/pSDrUwC16JFzKV6rs0GTBV5AtnKwvvRcv+5UMdNLkd4Sh73x6m+cQXOQOnPjNkRTxrGURzoGVqoSva31srSI4WZekGFQfsbJNtwQ9yFLrTkEXrcBlpvZgbuj9XOOFN6RnWnlJGG0PzFypLAo/ZEeGt8sc02ZGGO1ZS35eF93uZzhxOFAYCUwrFud+pBUY/YxPi4/rCPa/eIpaeo9N2qu567y9E1KTonmNzUXAbynEzK9BRIZZF22vAPfjxlPdUga3FA3GDl3ZlNzQOZy0oQ6SsxLT93uNbVm47sT7pud0zuCPqngy+ttIc/EWGofH9ZgWbUCoERoXAEPIRlJioF1rPyWeyLcOUUMcmUhlR0ebqczRMqrZKn2j2R0j/6SWDTPyVIZSIQaj37AvZnDq114h6N9KTYdLR6czod0aUrMN/CEtra1rx0kJPgH/TZ0aQiv+WDlPX/Sb30Eb2xOhfNX25WRTPMzHPxp4kbEQ5eVxsw5E19rJtpV1QkWC9u27vU4CLtU6xXDLQY7y3xX3BvMiIxL39tcG8p4e1srXphtO1d+1BQTFB3GDzhfe/CKw97Jo09F4BltnV0PuFtNzYvXRWRAfVeBXOANFDD0ACvAvkFJlOK1I+E+u1k4kUDHa9FMTDMC8vF6Z24eH3ZHPe+5JA6EfpJGdcex2XUwvPffI2OtLRNUaM0XOsGzJvJbg+kdUiRuLHZpI4F10tGdYqjwEdW+QzPkt5kZr8iVWmJeihgvP3JGkAm1DyJo989/y+HvGHYnBRwY4OhkYbNmUlSA7/SWMggyditgTvcYjha0mgODTFA26lpl6q17WC2dbQDW6XsmD2uIqdJba/KQs2VCoc9U9voxunAQ2t6rsEajHkLY3xjurNZV7eXNTmDUvvyrW9/GbtAB5J96UQlCvbev7gC/+IqzbumQsCo1yBi5rE1RI1GlJGM3AS1MqdviwkBWTpp7AGbBcFskpimyKI5lmh/OqLunbwfqmy+sTg1eGJiTISS4nbu0fd93loFKb5kXORRu/hja+21N/anlV1UvQ2cgFGN86E545RykzMXW1V9BFHJWKH7Z9NfLLSwTl2yJ+uy/JXquoeu0Hq6LBnOdY0m26e6DwOh3pPcljGcKaYbzaMSTTNJIeai93p/IE6Vg52Hxr4FLcdip1G86gKNaYMiQybepsBRlr8tu48mtx4ot8nbdMO4YGZvdWgajwUT4bTcTsmxmhBSFBOyqp+yMXFEGLnZ4Db2d1z3HJ9wNjhw+C8lY+AbYWLw2bd5gml4CFIQI6SlGJ67DTBKukHreEmZFGbkN3aTnvh1SXk+YFBJ/xwUblplRb128CvCzXJJi2BMGVFMbZbp2DU/Vxx6IUH1Dlp7yp3Ahy95vFkcWfMZKYc2BQje0u5AY4lQYrGbNDd9KwM5DC4lBe0RtLMge9akpMoR0bidvrZKFesAsntgNLYA/Cj3iYOry8yu2mqeul/psn4wgEYSChQ3A5EYIflWnibKXagixH6vWfOLPNT5n+FkFGgu6rJ0WbBEaORFUkamnllvBFuNsz7baMer5RbGGCTpoqcMmSHMqLMYd6K4IrV1VX/MzuOaf48In5F+4nrUkfIeJFLaSLKysnqqWA+QOPuv0rLMhOH1LDhHC7dmh/ljIevDQ1f7GUdpc0Lg4IpjuKUZe10mRTqCY5WZiNNlTHYAYtwRIvMJm2WpsivUcUlQCP6Pog9AtP0Mp9oMUbRoIR9fGqMhS00Tm3o3pZ6vRA+1UfEqUGcRS38EV1EbjrqhWzR+36hQ/kN56Q1Tju6t98S4TF0C3YtDlIhlkB+B1u6YeKO2arcNDBIyVLF0jDyqlI+veCEawKLsXB7mTdetTS0/kA5DNjv7Cy6wXpKLdux7egiLswWI3JSBus2xEHiMW5PknCpo4C/xvyA7k73kWQ0pUAeWus7K8QzkzR0U/8ek2k/eso/sxK/UzPmOG2rszi2hLgEa4yC9kjPtlwL88EoPcit6bhaIvwu5n7ij+PJUpmiKGy/srTbsVHWt/ii5KWUp/joCYUdyGrGBhJuBTDZbiZKORUIScEwk1dIgzzjhKSBltGeEe2zJlQ3kKWoabxny617MFGilDo/UbS/zgh5DaYEUyjCA1zE5LQ5NyPiG7nyW1nzUBhmMQiTeY4Q7P+mF/kzH+X1rO7pCcsUfjyWuDMGSGojI8rov9qCLOEqjxMp/gP+2y5r3pmy3Xz2oGPlyuoUhgp35VaSx4oCZJeLRmlAl7OzGnBhJcbsOLkduxEzuwPJmprKl4IaN/p1qUest0qR8haSRzov2fn+JA9Up/I0taBSAbPNMnKG1TUPJBv0zgpTxYMv4xw9HThL6JELvREdROSYu6ovAa2ekjpPLOEQRLLLPfrL/Y3ephgGb6Eyc6px2bACDtmgVjPwJre+7fbOmZt26nyO+dXcJjw+mcRlIHQHB9RX73TfEOe17y++OucBfhLEN94TTivd1pdVQq5IEvQ+Muj6fYodWA8K1n7DPFWpDhLevZDCxqt3ATuU7wGrSJ8E9PmRPRW/u7q+txoG2kCtEXYwCvA40SSzHZEgZUOWC/vTth1wvz2BBjMNoRmFPtq6j23ckcgX/VqFZRgMWcxfcIMJ52jsmvTa0Z6/jKHZIEedgaBqXWbKQWZXTFF716p86MzAO4t9l6+U38wDByHA0eboDbNRv5ZOoxlwE/eBWDHITkqSJr+XQP3ebgLU3lSjRHHngJG0qpX3Qy2M8Zd99+OyFXBOsqeylhj/+2lFJ7sW6JNk9Fw+b0qf0n3dU5mgdace7dwyoZWaFjA4dBbSsItDFiZEvxgJrKUhZ8fZsFekRdAtqO8AYRMI63hoGiIrPwkQ5NyM6My8uarGN+IP/TI3kNhyZmjIZORJ54mKlR288f0cJJA+DliHw3GvR0sRiEN+YrgjNKRo2L6Avk6xph9oOBnrpd3azbNamGAHmME9EhNSmWDps9dhhT9v6igGqriSl3SEoGbZJ/qnDSwJPraXan97uY7GjeCSEEx7lWTlyORg8xr1rQb1/WT3aUXI1PQ05y6av7UXsr+O/9KIa0YuwOtdRmQiCX/8At4xYz6WuzFfTx+znhjDKLlJ1Fy5Z5k8yE0/Ea8vZaPiFlRn4YW2UQnd0oSQ7ey0PhO/YwALizfxmY8mYj98y0YDnp5RscGq4vs30e0SCj4oqFbayPGlC8xnqkFreK7tXsMlvQIciXjYh7co4hdyaH8SOgsPLK+UgnUrzYEqzoTfFNOSie4UJk6AjxXWe5+JcaSji7aOxGGlugD7rEmFUAVItFyczR+7jQ4B6O4i5ZFuGSIHLrG1431daqag5hX2c/u85MXMViO0o/wc6W5bq1s4kxv40l1Df0douR5MHb35TcJulb9DB3urb6J/p9gRoHeg/V7esrOo9TBe/QkLopeejbrzDr0lU1gINdnNoceSf+7uOgDpCDSkkW4YifrXz7PgtYS58S/RF8Rq1r7sAgzvvnfjgC5OI+26pdc5frZIIA6iE4oAQxM6pe/gpK14gqS2ZX9OcWZxh0fdY53kasYMaOhfH1ng9eVEXRe0ISLUefwcHF3ZJPi4yEK6KjQtkdFMo9pruMDTjQr+z19TLNnCj33uRt8o2M5w+nCsdoFlgODBYRMAz0r91u4ZrwavxcATTLLmTWgiGQm6VTTYL7mFUoStLnfr05UDy/g5PyX+3oPU+Ibt+ABPfOjVCYuxnNMIhy6kJkrl++LJm1L2/VraNpQ5nFXB3p+jGeh9uNI3L4cGDbQp/RRkFr/tAjAilLjL6I1ZfgzZpwErYjELrQmCsC0xpuRwJ14zzl9ArcMZ3OXHS8NG2Eqc1k0rqF21PuvuoIPmNl5uZ6aDwhF7bEGsAEIgI8l4A/iNlgECUmtdsSZGEAN+u9/4zD+8IEbn/6ukQG16G7QQYwYNVvpd+E+7xsRuHq8tEcV96TUMrsYZOxVy9gb2O/EtW7Ba728zFiMf9AQZUWArhvgYl3f3x5U8om670hNWndvN8kbve59am6gj0kT8t/QmjggX2LI58bhE7vBk3YpgzvkcYCUIqMtny70b5dsZ2KsGwtObG7ySRfcnXHA093g2REoTLOEOspMIy59atkprrcCICN/ZpsW+r8K940dIKuozHBlM3DA6WQ4Bg1kp+hlGpf1hRg3TijmYTwtOJqGwf33OFp2dQvH1Ln25r6d1+qKlYpMkt7OCk++nYzWm11dqgWzChmTHMgxebvJCpJfDyRNP/vLqXNclMRA1c3VwBjsnacfvXV7wl6sfu1gpYuh/otkGgQZ7D2cP2jBwzXiDc080VcYMV3ew/defwSYutSyv0qUdrWVfcXYrpasfC7Y+odxrDpMpbXMA4B5mm/7E6iODd9MEcn6/qIHIGcLQJxDQ+D79jYd4AEIqbQNznWH0wFQdMFxV+wmNHJz0Ck0P5CGuu+E5pP4UdoBcSxc8FIxYL8MRCnz8Kkx+18U/a3uWzrH4hPHur5DLQzWRNtdOMpfrmT0nR6ieWFJqzcRy2GrngUg/1h8EvmeG+yh7b+TT/QRtJGJwWt01zBxG4qFPY1Z8jaeH/jE1iE29xBq7wlTQLHV0aNnWiydw7r+ODOEDftKoMh2G3Hax9T4TjbO3+9pbzyEQRquC76xKgpNcGQKDkVt1xu/JZsJm6nBhhSomTa1cySAUc4XSU8/FkgHSwIEnGNCm4O8BjXqRG+Ajit/ies9WqWJS2lY30opEBIsaFokyrq2e3iLbvvAfvynpKXdDa8uoI3l3u2xdH6xuj5Hq/ENKEztLk7JRH8o0gebvwQChFnqUcj1cLPMRharfOd1PISmovR0QP2Y2V5t0qszoFHY2ynmnClDemn6EE4X5QKHKsngu7/r0IltIuDXM9uaz+kFqN+d+4ebVxR7fNFqD1d4Tirm/LtfoUD0wjji1rftq25bSzC3OKQwOdT424F/MQvwKNHPtIDacAmb3t8uIMDj4sUn73uXceQKIlSc3i2oe6A3iPfRFbcngooR8U+6YXG/WThIdGEW8HFnXcP6tFoppRSHXASCNIBi0Kr3qBoc7UZT/pFHmheWkq62LxwtMK2RFS4Lv0a1sDwL2WfhEFbcv/gTwJlMEnpm8TwFsMykRMmj3ZvieyW+fjJhun1tMii92FiyOYP85hHVRWoma5eOoNu+eClg8BDMOip9NL9xou5JSXzy8t3vUkeRDVz9A9c5rm8oetJFE8AGmqR/nqz96ObQUFPpkokh7Z4HqAMgwx6hzZ1WzPyaWYzW9FKmSPqWw9+uqEpgZilZ/pa51gQW88CwO9/doKAnlgAp2ZRGhAIfXwzPTDLKMZJcv0lhKR2Q4wJdDms6e+iTbr04RmP1Ui/OueHYRuWrbZOepRZp/5opVsJ616GQ975OEzODd39q2p0Ngt0QByt+jwN9073mu5delmpTcrHtYelYOcTNjv6V1VWc6UFIhqeEHopICgT9XmOecFpTj69U+02mpVaNOFEsQ6DXmnhByWDv0XgEhU/9WdxiwLzEA5ZNyKR4gTAB3JhwiwlItEh/nFGFC8/NxpPTkQD4T6TK9lfsyLmRV+ou9NN/yeWYgxpGI0G06o6uYEKg4zULCu3UcjbMx0l5G4pZZkLFz0dnSgmsomqz3gSp0lGrgSXXH4U0nMWLRXGeYErziIRDIV1vPaVDXiqfAkONnCYzda1zDeueFTUf7+nD4b7lU3lGF+WyRJuiLe9z3xXROUsCJudq38C7oE9dC/6Zzmm0i2WYeQeE7+BSYIrvR8mdFppXV8AyoZ89RsaJQOuzxiEdpqEyvSUaomZp0l2Hpp9UABWMeJctjNdFM2awx0XK3ZzlZVxU/Fv1EfwvSA2hdqhaCpXOG6rCrjKPwwK6/C4YO6RHHNQ+wM1lP+NG8V6ezBrYYtSaTvNVnXj+3G0zCThaZdQp2cuAJh93DqMa9hbBryxDXoSnvpF5xhOM0EuNGZrouLFxJqg0DslZn4vhlRliZXCigYQ0aOhy9w/+tAhufzoCIn65AskpY90/zvLOwekBkqZhrJtH3hI9pBuXDP1t5/y/g/1wmGbD71pE42bLll0nGYSuWExEryPkxEBJrjWeqYRb1i0HiV3yeTzW5JtOz5Ze9Udl+9Nm+GK/zA2TQNTh+VrlXV/0kHOK9Bw6j9t+NsiiHAJnlwl2vvX4TJ7EhBX32VhJmlyfo65woFPcAwuQsVQ2Hf88HQI2c0UOhwtSqaL6fYehDQ7fN+OCloN+fTQExE/aAOB/DrXdkUV1+OGtE=","iv":"9cdca53122987345caefd0ac4848fc2a","s":"c4a902c3c03877de"};
        let entities={"ct":"bXDrTKRNZ3LKdB0JqtS+9t7LUvGgayq0zs1ezYSLfeYaz6Fe3Zg/nQjlbGHK91aW","iv":"a91747ec7997b6a1b1e0f30e6e812c5a","s":"c9f6d7e0ad3ff5b2"};
        let flows={"ct":"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","iv":"7dc1e870fc1e4585cec2ef9a81f56b38","s":"65b6e8efce0a450d"};

        let checkUrl='https://parramato.com/check';
        let modal=window.jubiModal;

        let backendUrl='https://parramato.com'
        let backendPath='/socket'
        
        let middlewareUrl = 'https://jubimoney.com'
        let middlewarePath = '/jubimoney/socket'
        let middlewareWebsocket = true
        let middlewareSecurity = false

        let uploadUrl = 'https://parramato.com'
        let uploadPath = '/upload/socket'

        let humanUrl = 'https://parramato.com'
        let humanPath = '/human/socket'

        let voiceUrl = 'https://parramato.com'
        let voicePath = '/voice/socket'

        let directMultiplier=1
        let fallbackMultiplier = 0.8

        let timeoutSeconds= 1200


        let strictlyFlow=true;
        let humanAssistSwitch=true;
        let voiceEnabled=true;
        let cookie=false;

        let speechGenderBackend='FEMALE'
        let speechLanguageCodeBackend='en-IN'

        let projectId='jubimoney_prod_125959905082'
        let attachmentUrl='https://parramato.com/bot-view/images/attachment.png'
        let integrityPassPhrase='hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
        let localSavePassPhrase='8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIjubimoney_prod_125959905082'
        //------CODE------
        //------end------
            //Setup
            //global function and param changes
            if (strictlyFlow) {
                $("#jubi-textInput").hide();
            }
            let channel = "web";
            let crypter = Crypt(passphrase);
            let crypterTransit = Crypt(passphraseTransit);
            let crypterMiddleware = Crypt(window.passphraseMiddleware + integrityPassPhrase);
            let crypterLocal = Crypt(window.passphraseMiddleware + integrityPassPhrase + projectId);
            window.passphraseMiddleware = null;
            const intentDocs = JSON.parse(crypter.decrypt(JSON.stringify(intents)));
            const entityDocs = JSON.parse(crypter.decrypt(JSON.stringify(entities)));
            // const storedClassifier=JSON.parse(crypter.decrypt(JSON.stringify(classifierData)));
            const flowDocs = JSON.parse(crypter.decrypt(JSON.stringify(flows)));
            if (!cookie) {
                clearAllLocalStorageData();
            }
            let user = {};

            let webId = get("id");
            if (webId) {
                webId = webId + "-" + IDGenerator(8);
                utmExtractor(webId);
                clearAllLocalStorageData();
            }
            let readyState = false;
            let thresholdDirect = 0.5;
            let thresholdOptions = 0.2;
            let decorateBotResponse;
            let lastTimestamp;
            let updateWebId;
            function clearAllLocalStorageData() {
                if (window.localStorage) {
                    window.localStorage.setItem(localSavePassPhrase, undefined);
                    window.localStorage.setItem("t_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("user_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("tags_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("webId_" + localSavePassPhrase, undefined);
                }
            }
            function setLocalStorageData(key, value) {
                if (window.localStorage) {
                    window.localStorage.setItem(key, value);
                }
            }
            function getLocalStorageData(key) {
                return window.localStorage ? window.localStorage.getItem(key) : undefined;
            }
            window.subscriptionForWebId = {
                setCallback: function (callback) {
                    updateWebId = callback;
                },
                getWebId: function () {
                    return webId;
                },
                getState: function () {
                    return readyState;
                }
            };

            (function () {

                try {
                    // console.log("tags")
                    let encryptedTags = getLocalStorageData("tags_" + localSavePassPhrase);
                    tags = JSON.parse(crypterLocal.decrypt(encryptedTags));
                    // console.log(tags)
                } catch (e) {
                    // console.log(e)
                }
                try {
                    // console.log("tags")
                    let encryptedUser = getLocalStorageData("user_" + localSavePassPhrase);
                    user = JSON.parse(crypterLocal.decrypt(encryptedUser));
                    // console.log(tags)
                } catch (e) {
                    // console.log(e)
                }
                if (!webId) {
                    let webIdData = getLocalStorageData("webId_" + localSavePassPhrase);
                    if (webIdData) {
                        try {
                            webIdData = JSON.parse(crypterLocal.decrypt(webIdData));
                            if (webIdData && webIdData.id) {
                                webId = webIdData.id;
                            }
                        } catch (e) { }
                    }
                }
                if (!webId) {
                    webId = IDGenerator(20);
                }
                webId = webId.replace(/ +?/g, '');
                let depth = 0;
                let totalQueries = 0;
                let totalIntents = 0;
                for (let intent of Object.keys(intentDocs)) {
                    totalQueries += intentDocs[intent].length;
                    totalIntents += 1;
                }
                depth = totalQueries / totalIntents;
                thresholdDirect = (1 - Math.tanh(Math.log10(depth + 1) * 0.5)) * directMultiplier;
                thresholdDirect = thresholdDirect > 1 ? 1 : thresholdDirect;
                thresholdOptions = thresholdDirect * fallbackMultiplier;
                console.log("confidence direct:" + thresholdDirect);
                console.log("confidence fallback:" + thresholdOptions);
            })();

            let socketHuman;
            let socketUpload;
            let socketVoice;
            let socketBackend;
            let socketMiddleware;
            (() => {
                try {
                    socketHuman = io(humanUrl, {
                        transports: ['websocket'],
                        path: humanPath
                    });
                    socketHuman.on('disconnect', function () {
                        tags.blockBot = undefined;
                        //online=false;
                        // console.log("Going Offline")
                        //disconnectVoice();
                        // offFunction();
                    });
                    socketHuman.on('connect', function () {
                        //online=true;
                        //onFunction();
                    });
                } catch (e) {
                    socketHuman = { on: () => { }, emit: () => { } };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = { on: () => { }, emit: () => { } };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = { on: () => { }, emit: () => { } };
                }

                try {
                    socketBackend = io(backendUrl, {
                        transports: ['websocket'],
                        path: backendPath
                    });

                    if (middlewareWebsocket) {
                        socketMiddleware = io(middlewareUrl, {
                            transports: ['websocket'],
                            path: middlewarePath
                        });
                    } else {
                        socketMiddleware = io(middlewareUrl, {
                            path: middlewarePath
                        });
                    }
                    // console.log("Separate Backend")
                    socketMiddleware.on('connect', function () {
                        window.socketId = socketMiddleware.id; //
                        online = true;
                        onFunction();
                    });
                } catch (e) {
                    socketBackend = { on: () => { }, emit: () => { } };
                    socketMiddleware = { on: () => { }, emit: () => { } };
                }
            })();

            String.prototype.replaceAll = function (search, replacement) {
                let target = this;
                return target.split(search).join(replacement);
            };
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            };
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            };
            //Internet On/Off Functions
            function onFunction() {
                $("#offlinebx").hide();
                console.log("ON:::");
            }
            function offFunction() {
                if (document.getElementById("offlinebx")) {
                    $("#offlinebx").show();
                } else {
                    document.getElementById("pm-mainSec").innerHTML += '<div class="offlinebx" id="offlinebx">' + '<div class="innerofline">' + '<h3>No connection, please refresh or check internet</h3>' + '</div>' + '</div>';
                }
            }
            //Init
            function init() {
                $(document).ready(function () {
                    $("#jubi-chat-loader-app").html(window.mainpage);
                    $("#jubisecmain").html(window.leftpanel + window.rightpanel);
                    $("#jubichatbot").html(window.templateOpenView + window.loadPermissionView);
                    window.mainpage = window.leftpanel = window.rightpanel = window.templateOpenView = window.loadPermissionView = undefined;
                    middleware();
                    setTimeout(() => {
                        $("#jubisecmain").fadeIn(100);
                        $("#jubichatbot").fadeIn(100);
                    }, 500);
                });
            }

            window.jubiChatEventEmitter = data => {
                triggerEvent({
                    senderId: webId,
                    channel: channel,
                    webInformation: deviceInfo,
                    projectId: projectId,
                    data: data,
                    type: "external"
                });
            };

            let triggerCallCount = 0;
            setInterval(() => {
                triggerCallCount = 0;
            }, 1000);

            function rateLimiter(func) {
                if (triggerCallCount < 30) {
                    triggerCallCount++;
                    func();
                } else {
                    console.log("Too Many requests");
                }
            }

            //Trigger Events
            function triggerEvent(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        if (window.jubiChatEventListener) {
                            window.jubiChatEventListener(event);
                        }
                        // console.log("EVENT "+event.type)
                        // console.log({data:event,webId:webId,requestId:uid})
                        socketBackend.emit("web-event-register", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => { });
                    }
                });
            }

            function triggerEventError(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        console.log("EVENT ERROR " + event.type);
                        console.log({ data: event, webId: webId, requestId: uid });
                        socketBackend.emit("web-event-register-error", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-error-" + webId + "-" + uid, () => { });
                    }
                });
            }

            //Invalidate
            async function invalidate(callbackOption, onlyInvalidateFlag) {
                try {
                    if (!onlyInvalidateFlag) {
                        if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                            let reply = await transform({
                                text: "It has been a while. Cancelled the previous conversation.",
                                type: "text"
                            });
                            decorateBotResponse(reply);
                        }
                    }
                    user.tracker = 0;
                    let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                    if (!cancelFlow) {
                        cancelFlow = {
                            stages: [{
                                text: ["Cancelling your current conversation."],
                                stage: "selectfallback",
                                type: "text"
                            }]
                        };
                    }
                    user.stages = cancelFlow.stages;
                    user.stuckCount = 0;
                    user.conversationId = undefined;
                    if (callbackOption) {
                        callbackOption();
                    }
                } catch (e) {
                    // console.log(e);
                    triggerEventError({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        type: "invalidate-1",
                        error: e
                    });
                }
            }

            function transform(response) {

                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
                function replaceTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    return text.replace(match, '');
                }
                function findMatch(str) {
                    let match = /\${(image|file|audio|video)::[^(${|})]+}/g.exec(str);
                    if (match && match.length > 0) {
                        return match;
                    } else {
                        return undefined;
                    }
                }
                function transformMediaOrText(text, i) {
                    if (findMatch(text)) {
                        let match = text.replace('${', '').replace('}', '').split('::');
                        return {
                            id: i,
                            type: match[0],
                            value: match[1]
                        };
                    } else {
                        return {
                            id: i,
                            type: 'text',
                            value: replaceTags(text)
                        };
                    }
                }

                return new Promise((resolve, reject) => {
                    try {
                        if (Array.isArray(response.text) && response.text.length == 1) {
                            response.text = response.text[0];
                        }
                        //extract media
                        let tempStr = response.text;
                        let match = findMatch(tempStr);
                        let mediaFlag = false;
                        let botMessage = [];
                        if (typeof response.text === 'string') {
                            while (match) {
                                response.text = response.text.replace(match[0], '\\n' + match[0] + '\\n');
                                tempStr = tempStr.replace(match[0], '');
                                match = findMatch(tempStr);
                                mediaFlag = true;
                            }
                            // new line
                            response.text = response.text.replaceAll('|break|', '\\n');
                            if (response.text && response.text.includes('\\n')) {
                                response.text = response.text.split('\\n');
                            } else if (response.text && response.text.length > 60 && !mediaFlag) {
                                sentTokenizer.setEntry(response.text);
                                response.text = sentTokenizer.getSentences();
                            }
                        }
                        if (typeof response.text === 'string') {
                            botMessage.push(transformMediaOrText(response.text, 0));
                        } else if (response.text instanceof Array) {
                            let textArray = response.text;
                            for (let i = 0; i < textArray.length; i++) {
                                botMessage.push(transformMediaOrText(textArray[i], i));
                            }
                        }
                        let options = [];
                        currentButtonContext = {};
                        switch (response.type) {
                            case 'button':
                                let sameButton = false;
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                    if (currentButtonContext[response.next.data[i].text.toLowerCase().trim()]) {
                                        sameButton = true;
                                        currentButtonContext = {};
                                    }
                                    if (!sameButton) {
                                        currentButtonContext[response.next.data[i].text.toLowerCase().trim()] = response.next.data[i].data.toLowerCase().trim();
                                    }
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'persist-option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'quickReply':
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'generic':
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'generic',
                                    options: response.next.data
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            default:
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'text'
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").show(200);
                                }
                                break;
                        }
                    } catch (e) {
                        triggerEventError({
                            senderId: webId,
                            channel: channel,
                            projectId: projectId,
                            type: "transform-1",
                            error: e
                        });
                        // console.log(e);
                        return reject(e);
                    }
                });
            }

            //Chat Engine
            let ChatEngine = function (callbackOption) {

                let callback = function (data) {
                    // console.log("no callback")
                    // console.log(data)
                };

                if (callbackOption) {
                    callback = callbackOption;
                }

                async function runOnNotification(data) {
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) { }
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    // console.log(data)
                    // console.log("Web-External")
                    let reply = await transform({
                        text: data.text,
                        type: data.type,
                        next: data.next
                    });
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        },
                        type: "notification"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        type: "pre",
                        reply: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        }
                    });
                    callback(reply);
                }

                function pre(requestedStage) {
                    return new Promise(function (resolve, reject) {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        requestedStage.webId = webId;
                        requestedStage.requestId = uid;
                        if (tags.blockBot) {
                            requestedStage.tags.blockBot = true;
                        }
                        requestedStage.tags = tags;
                        if (middlewareSecurity) {
                            socketMiddleware.emit("web-pre", crypterMiddleware.encrypt(JSON.stringify(requestedStage)));
                        } else {
                            socketMiddleware.emit("web-pre", JSON.stringify(requestedStage));
                        }

                        socketMiddleware.on("web-pre-" + webId + "-" + uid, receivedModel => {
                            try {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                            } catch (e) { }
                            if (typeof receivedModel == "string") {
                                receivedModel = JSON.parse(receivedModel);
                            }
                            resolve(receivedModel);
                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                input: requestedStage,
                                output: receivedModel,
                                type: "pre"
                            });
                            return;
                        });
                    });
                }

                async function runOnHumanNotification(data) {

                    // data = JSON.parse(crypterMiddleware.decrypt(data))
                    // console.log("Web external")
                    // console.log(data)
                    // console.log("Web-External")

                    let currentStage = {
                        text: data.text,
                        type: data.type,
                        next: data.next
                    };
                    let flowName;

                    if (!tags.blockBot && typeof data.text == 'string' && data.text.trim().startsWith("#")) {
                        flowName = data.text.replace("#", "");
                        let flow = flowDocs[flowName];
                        if (flow) {
                            user.tracker = 0;
                            user.stages = flow.stages;
                            user.stuckCount = 0;
                            user.conversationId = flow.flowId;
                            currentStage = clone(user.stages[user.tracker]);
                            if (!currentStage.firstMessage) {
                                currentStage.firstMessage = "";
                            }
                            if (Array.isArray(currentStage.text)) {
                                for (let index in currentStage.text) {
                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                }
                            } else {
                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                            }
                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                pre(currentStage).then(resolve).catch(e => {
                                    if (!online) {
                                        currentStage = {
                                            text: "Oh! I would require internet to help you here.",
                                            type: "text"
                                        };
                                    }
                                });
                            }
                        }
                    }

                    let reply = await transform(currentStage);
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        webInformation: deviceInfo,
                        projectId: projectId,
                        assistance: true,
                        input: {
                            user: user,
                            tags: tags
                        },
                        intentTrigger: flowName,
                        output: data,
                        blockBot: true,
                        flowDirection: "output",
                        type: "process"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        assistance: true,
                        type: "pre",
                        reply: currentStage
                    });
                    callback(reply);
                }

                socketMiddleware.on("web-external-" + webId.toString(), runOnNotification);
                socketMiddleware.on("web-timeout-" + webId.toString(), async function (data) {
                    invalidate(async () => {
                        callback((await transform(data)));
                    });
                });

                socketHuman.on("web-external-" + webId.toString(), runOnHumanNotification);
                socketHuman.on("start-bot-" + webId.toString(), function (data) {
                    tags.blockBot = undefined;
                    runOnHumanNotification(data);
                });
                socketHuman.on("pause-bot-" + webId.toString(), function () {
                    tags.blockBot = true;
                });

                this.processInput = async function (text) {
                    socketHuman.emit("postHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        intent: "",
                        type: "post",
                        reply: {
                            projectId: projectId,
                            data: {
                                text: text
                            },
                            sender: webId,
                            recipient: "jubiAiWeb"
                        },
                        time: new Date().getTime()
                    });
                    if (tags && !tags.blockBot) {
                        // console.log("PROCESS INPUT")
                        if (strictlyFlow) {
                            $("#jubi-textInput").hide(200);
                        }
                        try {
                            if (lastTimestamp === undefined) {
                                let encryptedLastTimestamp = getLocalStorageData("t_" + localSavePassPhrase);
                                if (encryptedLastTimestamp) {
                                    try {
                                        lastTimestamp = JSON.parse(crypterLocal.decrypt(encryptedLastTimestamp)).lastTimestamp;
                                    } catch (e) { }
                                }
                            }
                            if (lastTimestamp + parseInt(timeoutSeconds || 1200) * 1000 < new Date().getTime()) {
                                invalidate();
                            }
                            lastTimestamp = new Date().getTime();
                            setLocalStorageData("t_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ lastTimestamp: lastTimestamp })));

                            let timestampstart = new Date().getTime();
                            let engineOut = await runEngine(text);
                            let stage = engineOut.stage;
                            let timestampend = new Date().getTime();
                            setLocalStorageData("user_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(user)));

                            if (humanAssistSwitch) {
                                if (engineOut.status.final == "cancelStuck" || engineOut.status.final == "" || engineOut.status.final == "nextInvalid" || engineOut.status.final == "nextFallback") {
                                    //engineOut.status.final=undefined
                                    socketHuman.emit("assignAgentBackend", {
                                        data: {
                                            senderId: webId,
                                            bot: projectId
                                        },
                                        senderId: webId,
                                        projectId: projectId
                                    });
                                }
                            }

                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                webInformation: deviceInfo,
                                projectId: projectId,
                                input: {
                                    text: text,
                                    user: user,
                                    tags: tags
                                },
                                requestAssistance: tags.blockBot,
                                apiTime: timestampend - timestampstart,
                                output: stage,
                                nlu: engineOut.nlu,
                                status: engineOut.status,
                                type: "process"
                            });
                            if (!tags.blockBot) {
                                socketHuman.emit("preHandler", {
                                    senderId: webId,
                                    type: "pre",
                                    projectId: projectId,
                                    tags: tags,
                                    text: text,
                                    reply: stage
                                });
                                let reply = await transform(replaceTagsFromStage(stage));
                                callback(reply);
                            }
                        } catch (e) {
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "processinput-1",
                                error: e
                            });
                            // console.log(e);
                        }
                    } else {
                        triggerEvent({
                            senderId: webId,
                            channel: channel,
                            webInformation: deviceInfo,
                            projectId: projectId,
                            input: {
                                text: text,
                                user: user,
                                tags: tags
                            },
                            blockBot: true,
                            flowDirection: "input",
                            type: "process"
                        });
                    }
                };
                function replaceTagsFromStage(stage) {
                    if (Array.isArray(stage.text)) {
                        for (let index in stage.text) {
                            stage.text[index] = replaceAllTags(stage.text[index]);
                        }
                    } else {
                        stage.text = replaceAllTags(stage.text);
                    }
                    if (stage.type == "button" || stage.type == "quickReply") {
                        for (let index in stage.next.data) {
                            stage.next.data[index].data = replaceAllTags(stage.next.data[index].data);
                            stage.next.data[index].text = replaceAllTags(stage.next.data[index].text);
                        }
                    }
                    return stage;
                }

                function replaceAllTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    if (match) {
                        do {
                            // console.log(match[0])
                            let matchedTag = match[0].replace("${", "").replace("}", "");
                            if (tags[matchedTag]) {
                                text = text.replace(match[0], tags[matchedTag]);
                            } else {
                                text = text.replace(match[0], "");
                            }
                            match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                        } while (match);
                    }
                    return text;
                }

                function runEngine(text) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let timestamp1 = new Date().getTime();
                            tags["userSays"] = text;
                            let nluProcessedModel = await processNlu(cleanText(text));
                            // triggerEvent({
                            //     senderId:webId,
                            //     channel:channel,
                            //     projectId:projectId,
                            //     input:text,
                            //     output:nluProcessedModel,
                            //     type:"nlu"
                            // });
                            let timestamp2 = new Date().getTime();
                            let validatedModel = await processValidator(text, user, nluProcessedModel.entities);
                            let timestamp3 = new Date().getTime();
                            let prevStage = {};
                            if (user.stages) {
                                prevStage = user.stages[user.tracker];
                            }
                            if (user.previousOptions && user.previousQuery) {
                                let output = {
                                    intents: {}, entities: {}, top: []
                                    //entity extraction
                                }; for (let option of user.previousOptions) {
                                    // let entityData=replaceAllEntities(option.query,output);
                                    // let textReplaced = entityData.text
                                    // console.log("MATCH::::::::::::")
                                    // console.log("TEXT REPLACED:::::::::::::"+textReplaced)
                                    // console.log("TEXT:::::::::::::"+text)
                                    // console.log("OQ:::::::::::::"+option.query)
                                    if (text == option.query) {
                                        // console.log("MATCHED::::::::::::")
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            query: user.previousQuery,
                                            similar: option,
                                            type: "match"
                                        });
                                    }
                                }
                            }
                            user.previousOptions = undefined;
                            user.previousQuery = undefined;
                            let expectation;
                            if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                expectation = user.stages[user.tracker].next.expectation;
                            }
                            if (expectation) {
                                let saveResponse = await saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text);
                                if (saveResponse && saveResponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-1",
                                        error: saveResponse.error
                                    });
                                    // console.log(saveResponse.error);
                                }
                                if (saveResponse.tags) {
                                    tags = saveResponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(saveResponse.tags)));
                            } else {
                                saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text).then(response => {
                                    if (response && response.error) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "runengine-2",
                                            error: response.error
                                        });
                                        // console.log(reponse.error);
                                    }
                                    if (response.tags) {
                                        if (tags.blockBot) {
                                            response.tags.blockBot = true;
                                        }
                                        tags = response.tags;
                                    }
                                    if (validatedModel && validatedModel.data && prevStage && prevStage.stage) {
                                        tags[prevStage.stage] = validatedModel.data;
                                    }
                                    setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                                }).catch(e => {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-3",
                                        error: e
                                    });
                                    // console.log(e)
                                });
                                if (validatedModel && validatedModel.data) {
                                    tags[prevStage.stage] = validatedModel.data;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }
                            // console.log(tags)
                            let timestamp4 = new Date().getTime();
                            let flowManagerData = await processFlowManager({ query: text, intents: nluProcessedModel.intents, topIntents: nluProcessedModel.top, validation: validatedModel });
                            let stageModel = flowManagerData.response;
                            let status = flowManagerData.status;
                            let timestamp5 = new Date().getTime();
                            // console.log(timestamp2-timestamp1)
                            // console.log(timestamp3-timestamp2)
                            // console.log(timestamp4-timestamp3)
                            // console.log(timestamp5-timestamp4)
                            saveInformation("post", validatedModel, prevStage, stageModel, nluProcessedModel, text).then(reponse => {
                                if (reponse && reponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-4",
                                        error: reponse.error
                                    });
                                    // console.log(reponse.error);
                                }
                                if (reponse.tags) {
                                    if (tags.blockBot) {
                                        reponse.tags.blockBot = true;
                                    }
                                    tags = reponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }).catch(e => {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "runengine-5",
                                    error: e
                                });
                                // console.log(e)
                            });
                            return resolve({ stage: stageModel, nlu: nluProcessedModel, status: status });
                        } catch (e) {
                            if (!online) {
                                invalidate(async () => {
                                    callback((await transform({
                                        text: "Oh! I would require internet to help you here.",
                                        type: "text"
                                    })));
                                }, true);
                            }
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "runengine-6",
                                error: e
                            });
                            // console.log(e)
                            return reject(e);
                        }
                    });

                    function saveInformation(type, validatedModel, prevStage, stageModel, nluProcessedModel, text) {
                        return new Promise((resolve, reject) => {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let input = { type: type, validation: validatedModel, prevStage: prevStage, webId: webId, nlu: nluProcessedModel, text: text, stage: stageModel, requestId: uid };
                            if (middlewareSecurity) {
                                socketMiddleware.emit("web-save", crypterMiddleware.encrypt(JSON.stringify(input)));
                            } else {
                                socketMiddleware.emit("web-save", JSON.stringify(input));
                            }
                            socketMiddleware.on("web-save-" + webId + "-" + uid, receivedModel => {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                                resolve(receivedModel);
                                triggerEvent({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    input: input,
                                    output: receivedModel,
                                    type: "save"
                                });
                            });
                        });
                    }

                    // function getTokenizedData(text){
                    //     return tokenizer()
                    //     .input(text)
                    //     .token('data', /[a-zA-Z0-9]+/)
                    //     .resolve()
                    //     .data||[]
                    // }
                    function cleanText(text) {
                        //text tokenizing and cleaning
                        let tokenizedData = tokenizer().input(text).token('data', /[^!^@^-^_^=^\[^&^\/^\^^#^,^+^(^)^$^~^%^.^'^"^:^*^?^<^>^{^}^\]^0^1^2^3^4^5^6^7^8^9^\s]+/).resolve().data;
                        let resp = "";
                        if (tokenizedData) {
                            if (Array.isArray(tokenizedData)) {
                                resp = tokenizedData.reduce((text, value) => {
                                    return text.toLowerCase() + " " + value.toLowerCase();
                                });
                            } else {
                                resp = tokenizedData.toLowerCase().trim();
                            }
                        }
                        // console.log(":::::::::::")
                        // console.log(resp)
                        return resp;
                    }

                    function opinionFromLR(data) {
                        return new Promise(async function (resolve, reject) {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let requestData = {
                                data: data,
                                webId: webId,
                                requestId: uid
                            };
                            socketBackend.emit("web-opinion-lr", crypterTransit.encrypt(JSON.stringify(requestData)));
                            socketBackend.on("web-opinion-lr-" + webId + "-" + uid, receivedModel => {
                                receivedModel = JSON.parse(crypterTransit.decrypt(receivedModel));
                                if (receivedModel.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "opinionfromlr-1",
                                        error: receivedModel.error
                                    });
                                    // console.log(body.error)
                                    return reject(receivedModel.error);
                                }
                                // console.log(receivedModel)
                                return resolve(receivedModel);
                            });
                        });
                    }
                    function replaceAllEntities(text, output) {
                        //entity extraction
                        let entitiesDetected = [];
                        let filteredEntities = [];
                        let entitiesToBeDeletedIndices = [];
                        for (let label in entityDocs) {
                            for (let value in entityDocs[label]) {
                                let flag = false;
                                for (let token of entityDocs[label][value]) {
                                    // for( let textToken of getTokenizedData(text)){
                                    // if(textToken==token&&token.trim()!=""&&textToken.trim()!=""){
                                    if ((text.startsWith(token + " ") || text.endsWith(" " + token) || text.trim() == token || text && text.includes(" " + token + " ")) && token.trim() != "") {
                                        if (entitiesDetected.length == 0) {
                                            entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                            flag = true;
                                        }
                                        for (let index in entitiesDetected) {
                                            if (entitiesDetected[index].token && entitiesDetected[index].token.includes(token)) {
                                                flag = true;
                                                break;
                                            } else if (token && token.includes(entitiesDetected[index].token)) {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                entitiesToBeDeletedIndices.push(index);
                                                flag = true;
                                                break;
                                            } else {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                flag = true;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        break;
                                    }
                                    // }
                                    // }
                                }
                            }
                        }
                        for (let index in entitiesDetected) {
                            if (!entitiesToBeDeletedIndices || !entitiesToBeDeletedIndices.includes(index)) {
                                filteredEntities.push(entitiesDetected[index]);
                            }
                        }
                        output.entities = filteredEntities;

                        for (let element of filteredEntities) {
                            text = text.replaceAll(element.token, element.entity);
                        }
                        return { output: output, text: text };
                    }
                    function processNlu(text) {
                        return new Promise(async function (resolve, reject) {
                            try {

                                //output variable
                                let output = { intents: {}, entities: {}, top: [] };

                                let entityData = replaceAllEntities(text, output);
                                text = entityData.text;
                                output = entityData.output;

                                //exact match
                                let matchFlag = false;
                                let max = 0;
                                // console.log("QUERY")
                                // console.log(text)
                                let outputIntents = [];
                                for (let label in intentDocs) {
                                    for (let utterance of intentDocs[label]) {
                                        let score = 0;
                                        if (utterance.toLowerCase() == text.toLowerCase()) {
                                            score = 1;
                                            // console.log("MATCH MATCH")
                                        } else {
                                            score = stringSimilarity.compareTwoStrings(utterance, text);
                                        }

                                        // console.log(text+":::"+score+":::"+utterance)
                                        if (score > 0.95) {
                                            if (score > max) {
                                                output.intents = {
                                                    intent: label,
                                                    probability: score,
                                                    query: intentDocs[label][0]
                                                };
                                                max = score;
                                                matchFlag = true;
                                            } else if (max == score) {
                                                matchFlag = false;
                                            }
                                        }
                                        if (utterance == text) {
                                            outputIntents.push({
                                                intent: label,
                                                probability: 1,
                                                query: intentDocs[label][0]
                                            });
                                        }
                                    }
                                }
                                // console.log("OUTPUT INTENTS")
                                // console.log(outputIntents)
                                if (outputIntents.length > 1 || output.intents.probability && output.intents.probability < 0.97) {
                                    matchFlag = false;
                                } else if (outputIntents.length == 1) {
                                    matchFlag = true;
                                }
                                // console.log("INTENT DOCS")
                                // console.log(intentDocs)
                                // console.log("EXACT MATCH")
                                // console.log(matchFlag)
                                console.log("JUBI_REQUEST:" + text);

                                //ml based match
                                if (!matchFlag) {
                                    // //generate nb output
                                    // let classifier = new BayesClassifier()
                                    // for( let intent in intentDocs){
                                    //     classifier.addDocuments(intentDocs[intent], intent)
                                    // }

                                    // classifier.train();
                                    // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let nbTotalScore=0
                                    // // for( let element of classifier.getClassifications(text)){
                                    // //     nbTotalScore+=element.value
                                    // // }
                                    // // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let failoverData={
                                    // //     intents:{
                                    // //         intent:nbData[0].label,
                                    // //         probability:nbData[0].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[0].label][0]
                                    // //     },
                                    // //     top:[]
                                    // // }
                                    // // for( let i in nbData){
                                    // //     failoverData.top.push({
                                    // //         intent:nbData[i].label,
                                    // //         probability:nbData[i].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[i].label][0]
                                    // //     })
                                    // // }

                                    // // create shrinked data
                                    // // let shrinkedData=classifier.getClassifications(text)
                                    // console.log("NB DATA")
                                    // console.log(nbData)
                                    let shrinkedIndexedData = {};
                                    for (let element in intentDocs) {
                                        if (intentDocs[element].length > 0) {
                                            shrinkedIndexedData[element] = intentDocs[element];
                                        }
                                    }
                                    // console.log("TOTAL DATA")
                                    // console.log(shrinkedIndexedData)
                                    let results = [];
                                    try {
                                        //train bm25 on shrinked data
                                        let engine = bm25();
                                        engine.defineConfig({ fldWeights: { text: 1 } });
                                        engine.definePrepTasks([nlp.string.lowerCase, nlp.string.removeExtraSpaces, nlp.string.tokenize0, nlp.tokens.propagateNegations, nlp.tokens.stem]);
                                        for (let label in shrinkedIndexedData) {
                                            if (shrinkedIndexedData[label].length > 0) {
                                                let text = shrinkedIndexedData[label].reduce((text, value) => {
                                                    return text + " " + value;
                                                });
                                                engine.addDoc({ text: text }, label);
                                            }
                                        }
                                        engine.consolidate(4);
                                        //run query on shrinked data trained bm25
                                        results = engine.search(text, 5);
                                    } catch (e) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "processnlu-1",
                                            error: e
                                        });
                                        // console.log(e);
                                    }

                                    // console.log("BM25")
                                    // console.log(results)


                                    if (results.length > 1) {
                                        let bm25TotalScore = 0;
                                        for (let element of results) {
                                            bm25TotalScore += Math.exp(element[1]);
                                        }
                                        let requestData = {
                                            data: {},
                                            query: text
                                        };
                                        for (let result of results) {
                                            requestData.data[result[0]] = shrinkedIndexedData[result[0]];
                                            requestData.projectId = "projectBrowser";
                                        }
                                        try {
                                            let response = await opinionFromLR(requestData);
                                            triggerEvent({
                                                senderId: webId,
                                                channel: channel,
                                                projectId: projectId,
                                                input: requestData,
                                                output: response,
                                                type: "lr"
                                            });
                                            output.intents = {
                                                intent: response.intents[0].name,
                                                probability: parseFloat(response.intents[0].confidence),
                                                query: intentDocs[response.intents[0].name][0]
                                            };
                                        } catch (e) {
                                            // console.log(e);
                                            output.intents = {
                                                intent: results[0][0],
                                                probability: Math.exp(results[0][1]) / bm25TotalScore,
                                                query: intentDocs[results[0][0]][0]
                                            };
                                        }

                                        output.top = [];
                                        for (let element of results) {
                                            if (intentDocs[element[0]].length > 0) {
                                                output.top.push({
                                                    intent: element[0],
                                                    probability: Math.exp(element[1]) / bm25TotalScore,
                                                    query: intentDocs[element[0]][0]
                                                });
                                            }
                                        }
                                    } else {
                                        output.intents = {
                                            intent: "",
                                            probability: 0,
                                            query: ""
                                        };
                                        output.top = [];
                                    }
                                    // console.log("LR")
                                    // console.log(output)
                                }
                                return resolve(output);
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processnlu-2",
                                    error: e
                                });
                                // console.log(e);
                                return reject(e);
                            }
                        });
                    }
                    function processValidator(text, user, entities) {
                        let validator = {
                            wordList: wordList,
                            regex: regex,
                            post: post
                        };
                        return new Promise(async function (resolve, reject) {
                            try {
                                let expectation;
                                let post;
                                if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                    expectation = user.stages[user.tracker].next.expectation;
                                } else if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.post && user.stages[user.tracker].next.post.length > 0) {
                                    post = user.stages[user.tracker].next.post[0];
                                }

                                if (expectation && expectation.type) {
                                    let runFunc = validator[expectation.type].bind({ entities: entities, expectation: expectation, user: user });
                                    resolve((await runFunc(text)));
                                } else if (post && post.url) {
                                    let runFunc = validator["post"].bind({ entities: entities, post: post });
                                    resolve((await runFunc(text)));
                                } else {
                                    resolve({
                                        data: text,
                                        validated: true
                                    });
                                }
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processvalidator-1",
                                    error: e
                                });
                                // console.log(e)
                                return reject(e);
                            }
                        });

                        function post(input) {
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (!online) {
                                        return reject({ status: "offline" });
                                    }
                                    let model = {};
                                    let uid = IDGenerator(20);
                                    model.data = input;
                                    model.validated = true;
                                    model.webId = webId;
                                    model.requestId = uid;
                                    model.stage = user.stages[user.tracker];
                                    if (middlewareSecurity) {
                                        socketMiddleware.emit("web-post", crypterMiddleware.encrypt(JSON.stringify(model)));
                                    } else {
                                        socketMiddleware.emit("web-post", JSON.stringify(model));
                                    }
                                    socketMiddleware.on("web-post-" + webId + "-" + uid, receivedModel => {
                                        try {
                                            if (middlewareSecurity) {
                                                receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                            }
                                        } catch (e) { }
                                        if (typeof receivedModel == "string") {
                                            receivedModel = JSON.parse(receivedModel);
                                        }
                                        resolve(receivedModel);
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            input: input,
                                            output: receivedModel,
                                            type: "post"
                                        });
                                        return;
                                    });
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "post-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function wordList(input) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    // console.log(expectation)
                                    // console.log(entities)
                                    // console.log(input)
                                    if (expectation.val) {
                                        let entityValues = Object.keys(expectation.val);
                                        for (let entity of entities) {
                                            let flag = false;
                                            for (let value of entityValues) {
                                                if (entity.synonymGroup && typeof entity.synonymGroup == "string" && value && typeof value == "string" && entity.synonymGroup.trim() == value.trim()) {
                                                    flag = true;
                                                }
                                            }
                                            if (flag) {
                                                if (expectation.val[entity.synonymGroup]) {
                                                    model.stage = expectation.val[entity.synonymGroup];
                                                }
                                                // console.log(model.stage)
                                                // console.log(entities)
                                                // console.log(expectation)
                                                // console.log(":::::::::::STAGE::::::::::::")
                                                model.data = entity.synonymGroup;
                                                model.validated = true;
                                                return resolve(model);
                                            }
                                        }
                                    }
                                    model.data = input;
                                    model.validated = false;
                                    return resolve(model);
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "wordlist-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function regex(inp) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (expectation.val && expectation.val.trim()) {
                                        let reg = new RegExp(expectation.val.trim());
                                        if (expectation.val && inp.match(reg)) {
                                            model.data = inp.match(reg)[0];
                                            model.validated = true;
                                            return resolve(model);
                                        } else {
                                            model.validated = false;
                                            return resolve(model);
                                        }
                                    } else {
                                        model.validated = false;
                                        return resolve(model);
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "regex-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                    function processFlowManager(data) {
                        return new Promise(async function (resolve, reject) {
                            try {
                                let status = {
                                    level: "fallback",
                                    prevConversation: "qna",
                                    nextInitConversation: "invalid",
                                    validation: data.validation.validated,
                                    final: "",
                                    previousStage: ""
                                };
                                let topIntents = [];
                                if (data && data.topIntents) {
                                    for (let element of data.topIntents) {
                                        if (!element.intent.startsWith("st_")) {
                                            topIntents.push(element);
                                        }
                                    }
                                    data.topIntents = topIntents;
                                }
                                // console.log(data.intents.probability)
                                let flow = flowDocs[data.intents.intent];
                                if (data.intents.probability >= thresholdDirect) {
                                    status.level = "direct";
                                } else if (data.intents.probability >= thresholdOptions) {
                                    status.level = "options";
                                }
                                if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                                    status.prevConversation = "flow";
                                }
                                if (flow) {
                                    if (flow.stages.length == 1) {
                                        status.nextInitConversation = "qna";
                                    } else if (flow.stages.length > 1) {
                                        status.nextInitConversation = "flow";
                                    }
                                }

                                if (user && user.stuckCount === undefined) {
                                    user.stuckCount = 0;
                                }
                                if (status.level === "direct" && flow && flow.flowId && flow.flowId.toLowerCase().trim() === "selectemergency") {
                                    status.final = "cancel";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && data.intents.intent.toLowerCase().trim() === "selectprevious" && user.tracker > 0) {
                                    status.final = "inFlowPrevious";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && !user.stages[user.tracker].skipGhost) {
                                    status.final = "inFlowNextGhost";
                                    status.previousStage = "";
                                }
                                // else if (status.prevConversation=="flow"&&status.nextInitConversation=="flow"&&status.level=="direct"&&flow&&user.conversationId!=flow.flowId){
                                //     status.final="nextStart"
                                // }
                                else if (status.prevConversation == "flow" && status.validation) {
                                    status.final = "inFlowNextValidated";
                                    status.previousStage = user.stages[user.tracker].stage;
                                } else if (status.prevConversation == "flow" && !status.validation) {
                                    if (user.stuckCount < 3) {
                                        status.final = "inFlowNextInvalidated";
                                        status.previousStage = user.stages[user.tracker].stage;
                                    } else {
                                        status.final = "cancelStuck";
                                        status.previousStage = "";
                                    }
                                } else if (status.prevConversation == "qna" && status.nextInitConversation == "invalid") {
                                    status.final = "nextInvalid";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "qna" && status.level == "direct") {
                                    status.final = "nextStart";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "qna" && status.level == "options") {
                                    if (topIntents.length > 0) {
                                        status.final = "nextOptions";
                                        status.previousStage = "";
                                    } else {
                                        status.final = "nextFallback";
                                        status.previousStage = "";
                                    }
                                } else if (status.prevConversation == "qna" && status.level == "fallback") {
                                    status.final = "nextFallback";
                                    status.previousStage = "";
                                }
                                return resolve({ response: await decideResponse(flow, data, status), status: status });
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processflowmanager-1",
                                    error: e
                                });
                                // console.log(e);
                                return reject(e);
                            }
                        });

                        function decideResponse(flow, data, status) {
                            return new Promise((resolve, reject) => {
                                try {
                                    // console.log(status) 
                                    let fallbackFlow = flowDocs["selectfallback"] || flowDocs["selectFallback"];
                                    let currentStage;
                                    switch (status.final) {
                                        case "cancel":
                                            user.tracker = 0;
                                            let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                                            if (!cancelFlow) {
                                                cancelFlow = {
                                                    stages: [{
                                                        text: ["Cancelling your current conversation."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = cancelFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "cancelStuck":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["Cancelling, as it seems you are stuck somewhere."],
                                                stage: "selectfallback",
                                                type: "text"
                                            }];
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "inFlowPrevious":
                                            user.tracker = parseInt(user.tracker) - 1;
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    resolve(receivedStage);
                                                }).catch(e => {

                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextGhost":
                                            let text = "";
                                            if (Array.isArray(flow.stages[0].text)) {
                                                text = flow.stages[0].text[getRandom(flow.stages[0].text.length)];
                                            } else {
                                                text = flow.stages[0].text;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = text + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = text + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = text + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = text + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextValidated":
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            let validText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.validMessage) {
                                                validText = currentStage.next.expectation.validMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].validMessage) {
                                                validText = currentStage.next.post[0].validMessage;
                                            }
                                            let stageFound = false;
                                            if (data.validation.stage) {
                                                for (let index in user.stages) {
                                                    let stage = user.stages[index];
                                                    // console.log(":::::::::::::::::::::::")
                                                    // console.log(stage.stage)
                                                    if (stage.stage == data.validation.stage) {
                                                        user.tracker = index;
                                                        stageFound = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!stageFound) {
                                                user.tracker = parseInt(user.tracker) + 1;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = validText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = validText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = validText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = validText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "inFlowNextInvalidated":
                                            user.stuckCount = user.stuckCount + 1;
                                            currentStage = clone(user.stages[user.tracker]);
                                            // console.log(currentStage)
                                            let invalidText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.invalidMessage) {
                                                invalidText = currentStage.next.expectation.invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].invalidMessage) {
                                                invalidText = currentStage.next.post[0].invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = invalidText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = invalidText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = invalidText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = invalidText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "nextStart":
                                            user.tracker = 0;
                                            user.stages = flow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = flow.flowId;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (!currentStage.firstMessage) {
                                                currentStage.firstMessage = "";
                                            }
                                            if (Array.isArray(currentStage.text)) {
                                                for (let index in currentStage.text) {
                                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                                }
                                            } else {
                                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(resolve).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "nextFallback":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextInvalid":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextOptions":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["We have got following answers to help you."],
                                                stage: "optionsfallback",
                                                type: "generic",
                                                next: {
                                                    data: []
                                                }
                                            }];
                                            let index = 0;
                                            user.previousQuery = data.query;
                                            user.previousOptions = data.topIntents;
                                            for (let element of data.topIntents) {
                                                let reply;
                                                index++;
                                                if (flowDocs[element.intent] && flowDocs[element.intent].stages && flowDocs[element.intent].stages.length > 0) {
                                                    if (Array.isArray(flowDocs[element.intent].stages[0].text)) {
                                                        reply = flowDocs[element.intent].stages[0].text[0];
                                                    } else {
                                                        reply = flowDocs[element.intent].stages[0].text;
                                                    }
                                                }
                                                if (element.query && reply) {

                                                    user.stages[0].next.data.push({
                                                        title: capFirstLetter(element.query.trim()),
                                                        text: reply,
                                                        buttons: [{ data: element.query, text: "Read More" }]
                                                    });
                                                }
                                                function capFirstLetter(textSent) {
                                                    try {
                                                        return textSent.charAt(0).toUpperCase() + textSent.slice(1);
                                                    } catch (e) {
                                                        return textSent;
                                                    }
                                                }
                                            }
                                            if (user.stages[0].next.data.length == 0) {
                                                if (!fallbackFlow) {
                                                    fallbackFlow = {
                                                        stages: [{
                                                            text: ["Could not understand your query."],
                                                            stage: "selectfallback",
                                                            type: "text",
                                                            override: true
                                                        }]
                                                    };
                                                } else {
                                                    fallbackFlow.stages[0].override = true;
                                                }
                                                user.stages = fallbackFlow.stages;
                                                if (humanAssistSwitch) {
                                                    tags.blockBot = true;
                                                }
                                                status.final = "nextFallback";
                                            } else {
                                                user.stages[0].next.data.push({
                                                    title: "Not relevant",
                                                    text: "Did not match my query",
                                                    buttons: [{ data: "not relevant", text: "Select" }]
                                                });
                                            }
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        default:
                                            status.final = "nextFallback";
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;

                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "decideresponse-1",
                                        error: e
                                    });
                                    // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                }
            };
            //Chat Middleware Js
            function middleware() {
                let backendResponse;
                if (!backendResponse) {
                    backendResponse = false;
                }
                let booleanHideShow;
                let delayMaster = 500;
                let msgIndex = 0;
                let gender = null;
                let profile = undefined;
                let semaphoreForFirstChatLoad = true;
                let lastConversationSemaphore = true;
                let inputQuery = get("query");
                // let inputDefault=false;
                if (!inputQuery) {
                    inputQuery = 'investment advice';
                    // inputDefault=true;
                }
                if (!voiceEnabled || !online) {
                    // console.log("no speech")
                    hideVoice();
                }

                // setTimeout(async()=>{
                //     let currentState=await doesConnectionExist();
                //     if(currentState!=online){
                //         online=currentState;
                //         if(online){
                //             console.log("Going Online")
                //         }
                //         else{
                //             console.log("Going Offline")
                //             disconnectVoice();
                //         }
                //     } 
                // },1000);
                socketMiddleware.on('disconnect', function () {
                    online = false;
                    console.log("Going Offline");
                    disconnectVoice();
                    offFunction();
                });

                let ce = new ChatEngine(postReply);
                decorateBotResponse = postReply;
                socketBackend.on("web-webview-" + webId.toString(), async function (data) {
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) { }
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    ce.processInput(data.text);

                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                socketMiddleware.on("web-webview-" + webId.toString(), async function (data) {

                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) { }
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    ce.processInput(data.text);
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                String.prototype.replaceAll = function (search, replacement) {
                    let target = this;
                    return target.split(search).join(replacement);
                };
                function htmlInjectionPrevent(msg) {
                    if (msg) {
                        return msg.toString().replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
                    } else {
                        return msg;
                    }
                }
                function boot() {
                    try {
                        if (inputQuery && cookie) {
                            let encryptedData = getLocalStorageData(localSavePassPhrase);
                            if (encryptedData) {
                                let decryptedArray = JSON.parse(crypterLocal.decrypt(encryptedData));
                                // console.log("DECRYPTED ARRAY")
                                // console.log(decryptedArray)
                                let flagCookie = false;
                                for (let dataElement of decryptedArray) {
                                    if (dataElement.trim().startsWith("<div class='pm-bxRightchat'")) {
                                        flagCookie = true;
                                        break;
                                    }
                                }
                                if (decryptedArray.length > 1 && flagCookie) {
                                    let htmlToBeAdded = "";
                                    for (let element of decryptedArray) {
                                        htmlToBeAdded += element;
                                    }
                                    chatArray = decryptedArray;
                                    if (modal.cookie == "always") {
                                        if (updateWebId) {
                                            readyState = true;
                                            updateWebId(webId);
                                        }
                                        document.getElementById('pm-permission-view').style.display = "none";
                                        document.getElementById('pm-secIframe').style.display = "block";
                                        pushToChatStart(htmlToBeAdded);
                                        $(".bxCheckOPtion").remove();
                                        setTimeout(() => {
                                            try {
                                                console.log("called ");
                                                $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');
                                                scrollUp();
                                            } catch (e) {
                                                console.log(e);
                                            }
                                        }, 2000);

                                        if (tags && tags.blockBot && humanAssistSwitch) {
                                            socketHuman.emit("assignAgentBackend", {
                                                data: {
                                                    senderId: webId,
                                                    bot: projectId
                                                },
                                                senderId: webId,
                                                projectId: projectId
                                            });
                                        }
                                        scrollUp();
                                    } else {
                                        $('body').on("click", "#jubi-continue-storage", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                            pushToChatStart(htmlToBeAdded);
                                            $(".bxCheckOPtion").remove();
                                            setTimeout(() => {
                                                scrollUp();
                                            }, chatArray.length * 20);
                                            if (tags && tags.blockBot && humanAssistSwitch) {
                                                socketHuman.emit("assignAgentBackend", {
                                                    data: {
                                                        senderId: webId,
                                                        bot: projectId
                                                    },
                                                    senderId: webId,
                                                    projectId: projectId
                                                });
                                            }
                                        });
                                        $('body').on("click", "#jubi-start-fresh", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            invalidate(() => { }, true);
                                            clearAllLocalStorageData();
                                            chatArray = [];
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                            console.log(inputQuery);
                                            console.log(":::::::::::::::>>>>>>>>>>>");
                                            let ans = prepareJSONRequest(inputQuery);
                                            sendMessage(ans);
                                            scrollUp();
                                        });
                                        document.getElementById('pm-permission-view').style.display = "block";
                                        document.getElementById('pm-secIframe').style.display = "none";
                                    }

                                    return;
                                }
                            }
                        }
                        throw new Error("Default start");
                    } catch (e) {
                        let startTheBot = () => {
                            if (updateWebId) {
                                readyState = true;
                                updateWebId(webId);
                            }
                            clearAllLocalStorageData();
                            chatArray = [];
                            document.getElementById('pm-permission-view').style.display = "none";
                            document.getElementById('pm-secIframe').style.display = "block";
                            console.log("Start Message");
                            console.log(inputQuery);
                            user.stages = undefined;
                            user.tracker = 0;
                            user.conversationId = undefined;
                            let ans = prepareJSONRequest(inputQuery);
                            sendMessage(ans);
                            scrollUp();
                        };
                        if (!window.runOnJubiStartEvent) {
                            console.log("Starting Bot now");
                            startTheBot();
                        } else {
                            console.log("Starting Bot later");
                            window.jubiStartEvent = startTheBot;
                        }
                    }
                }

                let run = window.askBot = function (answer, type) {
                    console.log("askbot = " + answer)
                    if (answer.toLowerCase() === 'hindi') {
                        console.log("block")
                        stopVoice();
                        mute = true
                    }
                    lastConversationSemaphore = true;
                    let str;
                    if (answer.startsWith("upload_file>")) {
                        str = showFile(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    if (str) {
                        pushToChat(str);
                    }
                    let ans = prepareJSONRequest(answer);
                    sendMessage(ans, type);
                    scrollUp();
                };

                //--voice-work
                // Stream Audio
                let bufferSize = 2048,
                    AudioContext,
                    context,
                    processor,
                    input,
                    globalStream,
                    recognizer,
                    wholeString,
                    lastActiveTimestamp,
                    recordSemaphore = false,
                    flush,
                    mute = false; //st

                try {
                    document.getElementById('jubi-muteVoice').style.display = "none"; //st
                    if (voiceEnabled) {
                        document.getElementById('jubi-unmuteVoice').style.display = "block"; //st
                    } else {
                        document.getElementById('jubi-muteVoice').style.display = "none";
                    }
                } catch (e) { }

                $("body").on('click', '#jubi-unmuteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "none";
                    document.getElementById('jubi-muteVoice').style.display = "block";
                    mute = true;
                    stopVoice();
                });
                $("body").on('click', '#jubi-muteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "block";
                    document.getElementById('jubi-muteVoice').style.display = "none";
                    mute = false;
                });

                let resultText = document.getElementById('jubi-result-text'),
                    removeLastSentence = true,
                    streamStreaming = false;

                const constraints = {
                    audio: true,
                    video: false
                };

                function clearSpeechText() {
                    wholeString = "";
                    while (resultText && resultText.firstChild) {
                        resultText.removeChild(resultText.firstChild);
                    }
                    document.getElementById('jubi-recording-text').style.display = "none";
                    document.getElementById("pm-buttonlock").style.paddingBottom = "0px";
                }
                //voice
                function hideVoice() {
                    try {
                        document.getElementById('pm-textInput').style.display = "block";
                        document.getElementById('jubi-textInput').style.display = "none";
                        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
                        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
                    } catch (e) {
                        // console.log(e);
                    }
                }

                //voice ui -----------
                if (voiceEnabled) {
                    addVoiceListeners();
                }

                async function disconnectVoice() {
                    $("#jubi-bxinput").fadeIn(100);
                    $("#button-send").fadeIn(100);
                    $("#keyboard-icon").hide();
                    $("#voice-buttons").hide();
                    $("#jubi-answerBottom").focus();
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                    recordSemaphore = false;
                    wholeString = "";
                    clearSpeechText();
                    await stopAllRecordings();
                }

                function showVoice() {

                    $("#jubi-bxinput").hide();
                    $("#button-send").hide();
                    $("#keyboard-icon").fadeIn(50);
                    $("#voice-buttons").fadeIn(50);
                }

                function addVoiceListeners() {
                    $("#keyboard-icon").click(disconnectVoice);
                    $("#jubi-graySend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#jubi-redSend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#button-play-ws").click(() => {
                        recordSemaphore = true;
                        speechToText();
                    });
                    $("#button-stop-ws").click(async () => {
                        recordSemaphore = false;
                        if (wholeString) {
                            run(wholeString, "speech");
                        }
                        clearSpeechText();
                        await stopAllRecordings();
                    });
                }

                function hideStop() {
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                }

                function hidePlay() {
                    stopVoice();
                    $("#button-play-ws").hide();
                    $("#button-stop-ws").show();
                }

                //voice ui -----------

                //stop recording----

                function stopAllRecordings() {
                    return new Promise((resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            if (recognizer) {
                                recognizer.stop();
                                hideStop();
                                return resolve();
                            } else if (globalStream) {
                                streamStreaming = false;
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                let track = globalStream.getTracks()[0];
                                track.stop();
                                if (input) {
                                    input.disconnect(processor);
                                    processor.disconnect(context.destination);
                                    context.close().then(function () {
                                        input = null;
                                        processor = null;
                                        context = null;
                                        AudioContext = null;
                                        hideStop();
                                        return resolve();
                                    });
                                } else {
                                    hideStop();
                                    return resolve();
                                }
                            } else {
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                hideStop();
                                return resolve();
                            }
                        } catch (e) {
                            hideStop();
                            return reject(e);
                        }
                    });
                }

                //stop recording----


                //voice record------------------


                async function speechToText() {
                    try {
                        lastActiveTimestamp = new Date().getTime();
                        let interval = setInterval(async () => {
                            if (new Date().getTime() - lastActiveTimestamp > 15000) {
                                await stopAllRecordings();
                                clearInterval(interval);
                            }
                        }, 1000);
                        try {
                            await startRecordingOnBrowser();
                        } catch (e) {
                            await startRecordingFromAPI();
                        }
                        hidePlay();
                    } catch (e) {
                        // console.log(e);
                    }
                }

                function capitalize(s) {
                    if (s.length < 1) {
                        return s;
                    }
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }

                function addTimeSettingsInterim(speechData) {
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                    } catch (e) {
                        // console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }

                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_without_time = [];

                    for (let i = 0; i < nlpObject.length; i++) {
                        //data
                        let word = nlpObject[i].text;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = tags[j];
                            // console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_without_time.push(newSpan);
                    }

                    finalWord = false;
                    // endButton.disabled = true;

                    return words_without_time;
                }

                function addTimeSettingsFinal(speechData) {
                    let words = [];
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                        words = speechData.results[0].alternatives[0].words;
                    } catch (e) {
                        // console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }
                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_n_time = [];

                    for (let i = 0; i < words.length; i++) {
                        //data
                        let word = words[i].word;
                        let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
                        let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;
                        newSpan.dataset.startTime = startTime;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = nlpObject[i].tags[j];
                            // console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_n_time.push(newSpan);
                    }

                    return words_n_time;
                }

                function startRecordingOnBrowser() {
                    return new Promise(async (resolve, reject) => {
                        // return reject()
                        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                        if (window.SpeechRecognition === null) {
                            return reject();
                        } else {
                            recognizer = new window.SpeechRecognition();
                            recognizer.continuous = false;
                            recognizer.interimResults = true;
                            recognizer.lang = "en-IN";
                            recognizer.onresult = getResults;
                            try {
                                recognizer.start();
                            } catch (ex) {
                                // console.log(ex)
                                await stopAllRecordings();
                            }
                            recognizer.onerror = async function (event) {
                                // console.log(event)
                                await stopAllRecordings();
                            };
                            return resolve();
                        }
                    });
                }

                socketVoice.on('speech-data', data => {
                    data = crypterTransit.decrypt(data);
                    getResults(data);
                });

                function startRecordingFromAPI() {
                    function microphoneProcess(e) {
                        let left = e.inputBuffer.getChannelData(0);
                        let left16 = downsampleBuffer(left, 44100, 16000);
                        if (online) {
                            socketVoice.emit('web-speech-to-text-binary-data', { c: left16 });
                        }
                        function downsampleBuffer(buffer, sampleRate, outSampleRate) {
                            if (outSampleRate == sampleRate) {
                                return buffer;
                            }
                            if (outSampleRate > sampleRate) {
                                throw "downsampling rate show be smaller than original sample rate";
                            }
                            let sampleRateRatio = sampleRate / outSampleRate;
                            let newLength = Math.round(buffer.length / sampleRateRatio);
                            let result = new Int16Array(newLength);
                            let offsetResult = 0;
                            let offsetBuffer = 0;
                            while (offsetResult < result.length) {
                                let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
                                let accum = 0,
                                    count = 0;
                                for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                                    accum += buffer[i];
                                    count++;
                                }

                                result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
                                offsetResult++;
                                offsetBuffer = nextOffsetBuffer;
                            }
                            return result.buffer;
                        }
                    }
                    window.onbeforeunload = function () {
                        if (streamStreaming && online) {
                            socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                        }
                    };
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            socketVoice.emit('web-speech-to-text-start', crypterTransit.encrypt({ webId: webId })); //init socket Google Speech Connection
                            streamStreaming = true;
                            AudioContext = window.AudioContext || window.webkitAudioContext;
                            context = new AudioContext();
                            processor = context.createScriptProcessor(bufferSize, 1, 1);
                            processor.connect(context.destination);
                            context.resume();
                            let handleSuccess = function (stream) {
                                globalStream = stream;
                                input = context.createMediaStreamSource(stream);
                                if (input) {
                                    input.connect(processor);
                                    processor.onaudioprocess = function (e) {
                                        microphoneProcess(e);
                                        return resolve();
                                    };
                                }
                            };
                            navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(e => {
                                // console.log(e);
                                return reject(e);
                            });
                        } catch (e) {
                            return reject(e);
                        }
                    });
                }

                async function getResults(data) {
                    // console.log("RESPONSE")
                    // console.log(data.results)
                    document.getElementById('jubi-recording-text').style.display = "block";
                    lastActiveTimestamp = new Date().getTime();
                    let dataFinal = undefined || data.results[0].isFinal;
                    if (dataFinal === false) {
                        if (removeLastSentence) {
                            resultText.lastElementChild.remove();
                        }
                        removeLastSentence = true;

                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsInterim(data);

                        for (let i = 0; i < edit.length; i++) {
                            resultText.lastElementChild.appendChild(edit[i]);
                            resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        }
                        let height = parseInt($("#jubi-recording-text").height()) + 10;
                        document.getElementById("pm-buttonlock").style.paddingBottom = height + "px";
                        scrollUp();
                    } else if (dataFinal === true) {
                        if (resultText.lastElementChild) {
                            resultText.lastElementChild.remove();
                        }
                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsFinal(data);
                        for (let i = 0; i < edit.length; i++) {
                            if (i === 0) {
                                edit[i].innerText = capitalize(edit[i].innerText);
                            }
                            resultText.lastElementChild.appendChild(edit[i]);

                            if (i !== edit.length - 1) {
                                resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                            }
                        }
                        resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        // console.log(wholeString);
                        // console.log("Google Speech sent 'final' Sentence.");

                        finalWord = true;
                        removeLastSentence = false;
                        run(wholeString, "speech");
                        clearSpeechText();
                        await stopAllRecordings();
                    }
                    // console.log("HEIGHT")
                    // console.log($("#jubi-recording-text").height())
                }

                //voice record------------------


                //speech out-------
                async function textToSpeech(text) {
                    try {
                        await stopAllRecordings();
                    } catch (e) {
                        // console.log(e);
                    }
                    try {
                        let postSpeech;
                        // try{
                        //     postSpeech=await convertAndPlaySpeechOnBrowser(text);
                        // }
                        // catch(e){
                        postSpeech = await convertAndPlaySpeechFromAPI(text);
                        // }
                        // afterVoiceOut(postSpeech);
                    } catch (e) {
                        // console.log(e);
                    }
                }

                function afterVoiceOut(e) {
                    if (recordSemaphore) {
                        speechToText();
                        hidePlay();
                    }
                }

                function stopVoice() {
                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                    // if(window.SpeechRecognition != null&&responsiveVoice&&responsiveVoice.voiceSupport()){
                    //     responsiveVoice.cancel();
                    // }
                    if (flush && isPlaying(flush)) {
                        flush.pause();
                        flush.currentTime = 0;
                    }
                }
                $(document).on('click', 'body *', function () {
                    console.log("ok click")
                    stopVoice();
                    mute = true;
                });

                $(document).on('keypress', "body *", function () {
                    console.log("ok keypress")
                    stopVoice();
                    mute = true;
                });

                // function convertAndPlaySpeechOnBrowser(text){
                //     return new Promise(async(resolve,reject)=>{
                //         try{
                //             window.SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition || null;
                //             if (window.SpeechRecognition === null) {
                //                 return reject()
                //             }
                // if(responsiveVoice.voiceSupport()){
                //     responsiveVoice.speak(text, window.speechOnBrowser||"Hindi Female", {onstart: ()=>{}, onend: (data)=>{
                //         return resolve(data)
                //     }});
                // }
                // else{
                //     return reject("no web support");
                // }
                //         }
                //         catch(e){
                //             // console.log(e);
                //             return reject(e);
                //         }
                //     });

                // }

                function isPlaying(audelem) {
                    return !audelem.paused;
                }

                function removeHTMLTags(text) {
                    var div = document.createElement("div");
                    div.innerHTML = text;
                    return div.innerText;
                }

                var emojiArray = ['⚠','😄','🌵','👌','😨','😎','👩','👨','👤','❤️','💑','👶','👩','👨','👵','👴','💸','📅','💵','🚨','⏳','⛑️','👍','👎','➕','🏡','']
                
                var regex = /etc./gi;
                var regex1 = /etc/gi;

                var regexeg = /eg./gi;
                var regexeg1 = /eg/gi;
                var regexEg = /Eg/gi;
                var regexEg1 = /Eg/gi;
                var regexno = /no./gi;

                function textwithoutsplchar(botMsg){
                    emojiArray.forEach(function(element){
                        if (botMsg.includes(element)){
                            botMsg = botMsg.replace(element,'')
                        }
                    })
                    botMsg = botMsg.replace(regexEg, 'example  ').replace(regexEg1, 'example ')
                    botMsg = botMsg.replace(regex, 'et cetera ').replace(regex1, 'et cetera ')
                    botMsg = botMsg.replace(regexeg, 'example  ').replace(regexeg1, 'example ')
                    botMsg = botMsg.replace(regexno, 'number')
                    console.log(botMsg + 'botMsg')
                    return botMsg
                }

                function convertAndPlaySpeechFromAPI(text) {

                    return new Promise((resolve, reject) => {
                        text = removeHTMLTags(text)
                        text = textwithoutsplchar(text)
                        console.log('------' + text + '++++++++++++')
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        let requestData = {
                            data: {
                                text: removeHTMLTags(text),
                                gender: speechGenderBackend || "FEMALE",
                                languageCode: speechLanguageCodeBackend || "en-US"
                            },
                            webId: webId,
                            requestId: uid
                        };
                        socketVoice.emit("web-text-to-speech", crypterTransit.encrypt(requestData));
                        socketVoice.on("web-text-to-speech-" + webId + "-" + uid, data => {
                            // console.log(data)
                            data = crypterTransit.decrypt(data);
                            playVoiceFromAPI(data);
                        });
                        function playVoiceFromAPI(speech) {
                            // speech = JSON.parse(crypterTransit.decrypt(speech))
                            if (speech.error) {
                                return reject(speech.error);
                            }
                            if (speech.status == "success") {
                                if (!flush || !isPlaying(flush)) {
                                    flush = new Audio(speech.url);
                                    flush.play();
                                    flush.onended = () => {
                                        return resolve(speech);
                                    };
                                } else {
                                    setTimeout(playVoiceFromAPI, 500, speech);
                                }
                            } else {
                                return reject(speech);
                            }
                        }
                    });
                }

                //speech out-------


                function getAllText(message) {
                    let str = "";
                    for (let element of message) {
                        if (element.type == "text") {
                            str += element.value;
                        }
                    }
                    str = str.replace(/\|br\|/g, "");
                    str = str.replace(/\|break\|/g, "");
                    return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, ' ');
                }

                function scrollUp() {
                    $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');

                    if ($("#pm-buttonlock").height() > $("#pm-data").height() && $("#pm-buttonlock").height() > 0) {
                        $("#pm-data").css("display", "block");
                    }
                }

                function postReply(res) {
                    //ENABLE TEXT, HIDE RIGHT LOADER
                    // $('#pm-Rightbxloadgif').remove();
                    $('.pm-Rightbxloadgif').hide();
                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    // if (voiceEnabled && online && !mute) {
                    textToSpeech(getAllText(res.botMessage));
                    // }
                    //console.log(JSON.stringify(res, null, 3))
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    let answerType = res.answerType;
                    let count = res.botMessage.length;
                    gender = res.gender;
                    profile = res.profile;
                    let i = 0;
                    let incrementDelay = 0;
                    let totalDelay = 0;
                    let delayPop = delayMaster;
                    let sleepDelay = delayMaster * (3 / 4);
                    let delay = delayMaster * (1 / 10);
                    if (semaphoreForFirstChatLoad) {
                        semaphoreForFirstChatLoad = false;
                    } else {
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                            scrollUp();
                        }
                    }
                    show_replies();
                    async function show_replies() {
                        if (!$("#pm-bxloadgif").is(":visible")) {
                            $("#pm-buttonlock").append(prepareChatBotLoader());
                        }
                        $("#pm-bxloadgif").fadeOut(100);
                        $("#pm-bxloadgif").fadeIn(500);
                        await waitForAwhile(delayMaster);

                        let chatBotReponse = "";
                        if (res.botMessage[i].value == "CLOSE_IFRAME_ASAP") {
                            $(".showEditIframe").fadeOut(600);
                            setTimeout(() => {
                                $(".showEditIframe").remove();
                            }, 200);
                            res.botMessage.splice(i, 1);
                        } else if (res.botMessage[i].type == "text" && res.botMessage[i].value !== "") {
                            let url = res.botMessage[i].value.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/);
                            if (url) {
                                res.botMessage[i].value = res.botMessage[i].value.replaceAll(url[0], "<a target='_blank' href='" + url[0] + "'>" + url[0] + "</a>");
                            }
                            // if (i == 0 && lastConversationSemaphore) {
                            //     chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                            //     if (backendResponse && booleanHideShow != true) {
                            //         backendResponse = parseInt(backendResponse) + 1;
                            //     }
                            // }
                            // // else 
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "image") {
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "video") {
                            // console.log(res.botMessage[i].type + res.botMessage[i].value + "****")
                            // console.log(lastConversationSemaphore);
                            if (i == 0) {
                                chatBotReponse = prepareFirstVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "file" || res.botMessage[i].type == "audio") {
                            if (i == 0) {
                                chatBotReponse = prepareFirstFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else {
                            res.botMessage.splice(i, 1);
                        }
                        if (chatBotReponse) {
                            pushToChat(chatBotReponse);
                            $(".pm-bxloadgif").remove();
                        }

                        // if(i>0){
                        //     await waitForAwhile(700);

                        // }
                        scrollUp();
                        if (i == res.botMessage.length) {
                            lastConversationSemaphore = false;
                            if (res.options) {
                                pushToChat(prepareUserInput(res.answerType, res.options));
                            }
                            // else {
                            //     showTextInput();
                            // }
                        } else {
                            // console.log("Show replies")
                            show_replies();
                        }
                    }
                    msgIndex++;
                }
                function waitForAwhile(time) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            return resolve();
                        }, time);
                    });
                }
                function prepareUserInput(questionType, options) {
                    if (questionType == 'option') {
                        let str = optionStart();
                        for (let i = 0; i < options.length; i++) {
                            str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType == 'persist-option') {
                        let str = optionPersistStart();
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].type == "url") {
                                str = str + "<li><a href='" + htmlInjectionPrevent(options[i].data) + "' target='_blank' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].text) + "' class='question-options-persist-url'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else if (options[i].type == "webView") {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist-webView'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            }
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType = "generic") {
                        let str = buildGeneric(options);
                        // console.log(str)
                        setTimeout(function () {
                            slidebx();
                        }, 0);
                        return str;
                    }
                }
                function pushToChatStart(str) {
                    $(".pm-bxChat").append(str);
                    // $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxCheckOPtionPersist:last-child").hide();
                    // $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                }
                function pushToChat(str) {
                    // $("#pm-bxloadgif").remove();
                    // $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                    $(".pm-bxChat").append(str);
                    // $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxCheckOPtionPersist:last-child").hide();
                    // $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                    chatArray.push(str);
                    // console.log(chatArray);
                    setLocalStorageData(localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(chatArray)));
                    setLocalStorageData("webId_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ id: webId })));
                }
                function pushToView(str) {
                    $("#pm-mainSec").append(str);
                }

                function prepareJSONRequest(answer) {
                    return {
                        text: answer
                    };
                }
                function genericStart() {
                    return '<div class="pm-owlsliderbx"><div class="slider-inner pm-slider-inner"><div  class="owl-carousel owl-theme">';
                }
                function replaceAll(str, find, replace) {
                    if (typeof str == "string") {
                        return str.replace(new RegExp(find, 'g'), replace);
                    }
                    return str;
                }
                function buildGeneric(data) {
                    let html = '';
                    if (data && data.length > 0 && data[0].buttons && data[0].buttons.length > 0) {
                        html = genericStart();
                        for (let i = 0; i < data.length; i++) {
                            html += '<div class="item">';
                            if (data[i].image) {
                                html += '<div class="pm-slideImage"><img src="' + data[i].image + '"></div>';
                            }
                            html += '<div class="pm-sliderContent">';
                            if (data[i].title) {
                                html += '<h5> ' + data[i].title + '</h5>';
                            }
                            if (data[i].text) {
                                // console.log(data[i].text)
                                html += '<p>' + data[i].text.replaceAll("|br|", "<br/>") + '</p>';
                            }
                            html += '</div><div class="pm-bxslidebtn">';
                            for (let j = 0; j < data[i].buttons.length; j++) {
                                let options = data[i].buttons[j];
                                options.text = replaceAll(options.text, "'", " ");
                                options.data = replaceAll(options.data, '"', " ");
                                if (options.type == "url") {
                                    html += "<a href='" + options.data + "' target='_blank' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options-url'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                } else {
                                    html += "<a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                }
                            }
                            html += '</div>';
                            html += '</div>';
                        }

                        html += genericEnd();
                    }
                    return html;
                }
                function genericEnd() {
                    return '</div></div></div>';
                }
                function prepareChatBotReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput' >" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput' >" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime jubi-left_msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotLoader() {
                    let d = getTime();
                    return "<div id='pm-bxloadgif' class='pm-bxuser_question pm-bxloadgif ' style='visibility: visible;'><div class='pm-leftInputGif'><div class='pm-leftUserimg'><img src='" + modal.static.images.botIcon + "' class='img-responsive'></div><div class='pm-innerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div></div></div>";
                }
                function prepareChatBotUserLoader() {
                    return "<div class='pm-bxRightchat'>" + "<div id='pm-Rightbxloadgif' class='pm-bxuser_question pm-Rightbxloadgif'>" + "<div class='pm-leftInputGif'>" +
                        // // "<div class='pm-leftUserimg'>"+
                        // //     "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>"+
                        // // "</div>"+
                        // "<div class='pm-rightUserimg'><img src='./images/user.png'></div>"+
                        "<div class='pm-innerloadgif pm-Rightinnerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div>" + "</div>" + "</div>" + "</div>";
                }
                function showWebView(url) {
                    return '<div class="showEditIframe" id="iframeView">' + '<div class="closeIframeBtn"><img src="' + modal.static.images.closeWebView + '" class="img-responsive"></div>' + '<iframe src="' + url + '" frameborder="0" -webkit-overflow-scrolling:="" touch;="" allowfullscreen="" style="overflow:hidden;"></iframe>' + '</div>';
                }
                function showFile(answer) {

                    let arr = answer.split(">");
                    if (arr.length == 2) {
                        let isImage = checkForImage(arr[1]);
                        let imageUrl = htmlInjectionPrevent(arr[1]);
                        let d = getTime();
                        if (isImage) {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<div class='pm-postImg'>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + imageUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        } else {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        }
                    } else {
                        return;
                    }
                }
                function checkForImage(url) {
                    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
                }
                function showAnswer(answer) {
                    let d = getTime();
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showMaleAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showFemaleAnswer(answer) {

                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userFemaleIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function optionStart() {
                    return "<div class='pm-bxCheckOPtion' style='visibility: visible; '>" + "<ul >";
                }
                function optionPersistStart() {
                    return "<div class='pm-bxCheckOPtionPersist' style='visibility: visible; '>" + "<ul >";
                }
                function optionEnd() {
                    return "</ul></div>";
                }
                function showProfileAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function prepareTextInputProfileBox() {
                    return "<div class='pm-anwser-div pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<input class='form-control input-lg answer' data-id='" + msgIndex.toString() + "' autofocus='autofocus' type='text' placeholder='Type and hit enter'>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function sendMessage(data, type) {
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    $('.pm-Rightbxloadgif').hide();

                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    if (tags && !tags.blockBot) {
                        // console.log(JSON.stringify(data, null, 3))
                        deviceInfo.inputType = type || "text";
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                        }
                        scrollUp();
                        setTimeout(_ => {
                            $("#pm-bxloadgif").remove();
                            $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                        }, 5000);
                    }

                    setTimeout(() => {
                        if (currentButtonContext && data && data.text)
                            data.text = currentButtonContext[data.text.toLowerCase().trim()] || data.text;
                        ce.processInput(data.text);
                    }, 100);
                }
                function slidebx() {
                    let count = 0;
                    $('.owl-carousel').each(function () {
                        $(this).attr('id', 'owl-demo' + count);
                        $('#owl-demo' + count).owlCarousel({
                            items: 2,
                            // singleItem:true,
                            // itemsDesktop: [1000, 1], 
                            // itemsDesktopSmall: [900, 1], 
                            // itemsTablet: [700, 1], 
                            // itemsMobile: [479, 1], 
                            navigation: true,
                            navigation: !0,
                            navigationText: ["&#8249", "&#8250"],
                            nav: true,
                            responsiveClass: true,
                            responsive: {
                                0: {
                                    items: 1
                                },
                                700: {
                                    items: 1
                                },
                                900: {
                                    items: 2
                                },
                                1300: {
                                    items: 2
                                }
                            }

                        });
                        count++;
                    });
                }

                $('body').on("change", ".jubi-file-upload", function (e) {
                    console.log("FILE UPLOAD");
                    $("#pm-buttonlock").append(prepareChatBotUserLoader());
                    scrollUp();
                    let timeoutVar = setTimeout(() => {
                        let str = showAnswer("Could not upload file. Please try a smaller file. Should be below 500kb ideally.");
                        scrollUp();
                        $('.pm-Rightbxloadgif').hide();
                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                        $(".inputfile").css("display", "none");
                        pushToChat(str);
                    }, 30000);
                    let input = e.target;
                    if (input.files && input.files[0]) {
                        let reader = new FileReader();
                        reader.readAsDataURL(input.files[0]);
                        reader.onloadend = function () {
                            let data = {
                                file: this.result,
                                webId: new Date().getTime()
                            };
                            if (online) {
                                socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                socketUpload.on('upload-complete-' + data.webId, function (data) {
                                    data = JSON.parse(crypterTransit.decrypt(data));
                                    // console.log(JSON.stringify(data))
                                    if (data.url) {
                                        clearInterval(timeoutVar);
                                        run("upload_file>" + data.url, "file");
                                        //RIGHT LOADER
                                        // $('#jubi-answerBottom').prop('disabled', true);
                                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                        $(".inputfile").css("display", "none");
                                    }
                                });
                            }
                        };
                    } else {
                        let files = !!this.files ? this.files : [];
                        if (!files.length || !window.FileReader) return;
                        if (/^image/.test(files[0].type)) {
                            let reader = new FileReader();
                            reader.readAsDataURL(files[0]);
                            reader.onloadend = function () {
                                let data = {
                                    file: this.result,
                                    webId: webId
                                };
                                if (online) {
                                    socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                    socketUpload.on('upload-complete-' + data.webId, function (data) {
                                        data = JSON.parse(crypterTransit.decrypt(data));
                                        if (data.url) {
                                            clearInterval(timeoutVar);
                                            // console.log(JSON.stringify(data))
                                            run("upload_file>" + data.url, "file");
                                            //RIGHT LOADER
                                            // $('#jubi-answerBottom').prop('disabled', true);
                                            document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                            $(".inputfile").css("display", "none");
                                        }
                                    });
                                }
                            };
                        }
                    }
                });

                $("body").on('click', '.question-options-persist-webView', function (e) {
                    let url = $(this).attr('inner-id');
                    let str = showWebView(url);
                    scrollUp();
                    pushToView(str);
                });
                $("body").on('click', ".closeIframeBtn", function (e) {
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 1000);
                });
                $(".pm-menu_val").click(function (e) {
                    let answer = $(this).text();
                    if (answer.trim() != "") {
                        lastConversationSemaphore = true;
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.bxgetthefull', function (e) {
                    lastConversationSemaphore = true;
                    let inner = $(this).attr('inner-id');
                    let answer = $(this).attr('data-id');
                    $(".pm-bxCheckOPtion").remove();
                    $(".answer").parent().parent().remove();

                    let str = null;
                    if (profile) {
                        str = showProfileAnswer(answer);
                    } else if (gender && gender == "male") {
                        str = showMaleAnswer(answer);
                    } else if (gender && gender == "female") {
                        str = showFemaleAnswer(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    scrollUp();
                    pushToChat(str);
                    let ans1 = prepareJSONRequest(inner);
                    sendMessage(ans1);
                });
                $("body").on('click', '.question-options', function (e) {

                    stopVoice();
                    mute = true;

                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        $(".bxCheckOPtion").remove();
                        $(".answer").parent().parent().remove();

                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.question-options-persist', function (e) {

                    stopVoice();
                    mute = true;

                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#pm-bottomClick', function () {
                    let answer = $("#pm-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#pm-answerBottom', function (e) {

                    let answer = $("#pm-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#jubi-bottomClick', function () {
                    let answer = $("#jubi-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#jubi-answerBottom', function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });

                $("#jubi-answerBottom").keydown(function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("#pm-answerBottom").click(scrollUp);
                $("#jubi-answerBottom").click(scrollUp);
                $(".pm-showmenubx").css("display", "none");
                $(".pm-showMenu").click(function () {
                    $(".pm-showmenubx").toggle(400);
                });
                $("#pm-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#pm-answerBottom').val('').empty();
                    }, 500);
                });
                $("#pm-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#pm-answerBottom').val('').empty();
                    }
                });
                $("#jubi-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#jubi-answerBottom').val('').empty();
                    }, 500);
                });
                $("#jubi-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#jubi-answerBottom').val('').empty();
                    }
                });
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide(200);
                });
                $(".pm-iconMenu").click(function () {
                    $("#pm-secMenucontent").toggle();
                });
                $("#pm-secMenucontent").click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $('.pm-bxform').click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $(".pm-bxChat").animate({ scrollTop: $(document).height() }, "slow");
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide();
                });
                $("#pm-secCloseview").click(function () {
                    $('#pm-chatOpenClose').toggleClass('doChatOpenClose');
                });

                $(".pm-sec_closeview").click(function () {
                    $(".pm-sec_closeview").hide();
                    $(".pm-sec_calliframe").fadeIn(500);
                    $(".pm-secHideChat").show(500);
                    $(".pm-secCloseMsg").hide();
                    booleanHideShow = true;
                    backendResponse = '0';
                });
                $(".pm-secHideChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $(".pm-sec_closeview").show(800);
                    $(".pm-secHideChat").hide(500);
                    $('#pm-chatOpenClose').removeClass('doChatOpenClose');
                    booleanHideShow = false;
                });
                $("#pm-sec_closeviewMobile").click(function () {
                    $("#pm-sec_closeviewMobile").hide(500);
                    $(".pm-sec_calliframe").fadeIn(500);
                });
                $("#pm-secHideMobileChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $("#pm-sec_closeviewMobile").show(500);
                });
                boot();
            }
            //Helper Functions
            // Clones an Object
            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
            //Chooses random value
            function getRandom(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }
            //Fetch Get Params
            function get(name) {
                if (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(location.search)) {
                    return decodeURIComponent(name[1]);
                }
            }
            //Generates random id
            function IDGenerator(length) {
                let timestamp = +new Date();
                let _getRandomInt = function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };
                let ts = timestamp.toString();
                let parts = ts.split("").reverse();
                let id = "";

                for (let i = 0; i < length; ++i) {
                    let index = _getRandomInt(0, parts.length - 1);
                    id += parts[index];
                }
                return id;
            }
            // function doesConnectionExist() {
            //     return new Promise((resolve,reject)=>{
            //         let xhr = new XMLHttpRequest();
            //         let randomNum = Math.round(Math.random() * 10000);

            //         xhr.open('HEAD', window.location + "?rand=" + randomNum, true);
            //         xhr.send();

            //         xhr.addEventListener("readystatechange", processRequest, false);

            //         function processRequest(e) {
            //         if (xhr.readyState == 4) {
            //             if (xhr.status >= 200 && xhr.status < 304) {
            //                 return resolve(true);
            //             } else {
            //                 return resolve(false);
            //             }
            //         }
            //         }
            //     })
            // }
            //Invoking Chain of operations
            init();
        })();
    }, { "sentence-tokenizer": 8, "string-similarity": 12, "string-tokenizer": 14, "wink-bm25-text-search": 16, "wink-nlp-utils": 61 }], 3: [function (require, module, exports) {
        /*!
         * array-last <https://github.com/jonschlinkert/array-last>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        var isNumber = require('is-number');

        module.exports = function last(arr, n) {
            if (!Array.isArray(arr)) {
                throw new Error('expected the first argument to be an array');
            }

            var len = arr.length;
            if (len === 0) {
                return null;
            }

            n = isNumber(n) ? +n : 1;
            if (n === 1) {
                return arr[len - 1];
            }

            var res = new Array(n);
            while (n--) {
                res[n] = arr[--len];
            }
            return res;
        };
    }, { "is-number": 4 }], 4: [function (require, module, exports) {
        /*!
         * is-number <https://github.com/jonschlinkert/is-number>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        'use strict';

        module.exports = function isNumber(num) {
            var type = typeof num;

            if (type === 'string' || num instanceof String) {
                // an empty string would be coerced to true with the below logic
                if (!num.trim()) return false;
            } else if (type !== 'number' && !(num instanceof Number)) {
                return false;
            }

            return num - num + 1 >= 0;
        };
    }, {}], 5: [function (require, module, exports) {
        'use strict';

        // modified from https://github.com/es-shims/es5-shim

        var has = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var slice = Array.prototype.slice;
        var isArgs = require('./isArguments');
        var isEnumerable = Object.prototype.propertyIsEnumerable;
        var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
        var hasProtoEnumBug = isEnumerable.call(function () { }, 'prototype');
        var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
        var equalsConstructorPrototype = function (o) {
            var ctor = o.constructor;
            return ctor && ctor.prototype === o;
        };
        var excludedKeys = {
            $applicationCache: true,
            $console: true,
            $external: true,
            $frame: true,
            $frameElement: true,
            $frames: true,
            $innerHeight: true,
            $innerWidth: true,
            $outerHeight: true,
            $outerWidth: true,
            $pageXOffset: true,
            $pageYOffset: true,
            $parent: true,
            $scrollLeft: true,
            $scrollTop: true,
            $scrollX: true,
            $scrollY: true,
            $self: true,
            $webkitIndexedDB: true,
            $webkitStorageInfo: true,
            $window: true
        };
        var hasAutomationEqualityBug = function () {
            /* global window */
            if (typeof window === 'undefined') {
                return false;
            }
            for (var k in window) {
                try {
                    if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
                        try {
                            equalsConstructorPrototype(window[k]);
                        } catch (e) {
                            return true;
                        }
                    }
                } catch (e) {
                    return true;
                }
            }
            return false;
        }();
        var equalsConstructorPrototypeIfNotBuggy = function (o) {
            /* global window */
            if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
                return equalsConstructorPrototype(o);
            }
            try {
                return equalsConstructorPrototype(o);
            } catch (e) {
                return false;
            }
        };

        var keysShim = function keys(object) {
            var isObject = object !== null && typeof object === 'object';
            var isFunction = toStr.call(object) === '[object Function]';
            var isArguments = isArgs(object);
            var isString = isObject && toStr.call(object) === '[object String]';
            var theKeys = [];

            if (!isObject && !isFunction && !isArguments) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var skipProto = hasProtoEnumBug && isFunction;
            if (isString && object.length > 0 && !has.call(object, 0)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i));
                }
            }

            if (isArguments && object.length > 0) {
                for (var j = 0; j < object.length; ++j) {
                    theKeys.push(String(j));
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && has.call(object, name)) {
                        theKeys.push(String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

                for (var k = 0; k < dontEnums.length; ++k) {
                    if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
                        theKeys.push(dontEnums[k]);
                    }
                }
            }
            return theKeys;
        };

        keysShim.shim = function shimObjectKeys() {
            if (Object.keys) {
                var keysWorksWithArguments = function () {
                    // Safari 5.0 bug
                    return (Object.keys(arguments) || '').length === 2;
                }(1, 2);
                if (!keysWorksWithArguments) {
                    var originalKeys = Object.keys;
                    Object.keys = function keys(object) {
                        // eslint-disable-line func-name-matching
                        if (isArgs(object)) {
                            return originalKeys(slice.call(object));
                        } else {
                            return originalKeys(object);
                        }
                    };
                }
            } else {
                Object.keys = keysShim;
            }
            return Object.keys || keysShim;
        };

        module.exports = keysShim;
    }, { "./isArguments": 6 }], 6: [function (require, module, exports) {
        'use strict';

        var toStr = Object.prototype.toString;

        module.exports = function isArguments(value) {
            var str = toStr.call(value);
            var isArgs = str === '[object Arguments]';
            if (!isArgs) {
                isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
            }
            return isArgs;
        };
    }, {}], 7: [function (require, module, exports) {
        'use strict';

        module.exports = function (obj) {
            var keys = Object.keys(obj);
            var ret = [];

            for (var i = 0; i < keys.length; i++) {
                ret.push(obj[keys[i]]);
            }

            return ret;
        };
    }, {}], 8: [function (require, module, exports) {
        "use strict";

        // eslint-disable-next-line no-unused-vars

        var debug = require('debug')('tokenizer');

        function compact(str) {
            var res = str.trim();
            res = res.replace('  ', ' ');
            return res;
        }

        function Tokenizer(username, botname) {

            // // Maybe it is not useful
            // if (!(this instanceof Tokenizer)) {
            //   return new Tokenizer();
            // }

            this.username = username || 'Guy';
            this.entry = null;
            this.sentences = null;

            if (typeof botname == 'string') {
                this.botname = botname;
            } else {
                this.botname = 'ECTOR';
            }
        }

        Tokenizer.prototype = {
            setEntry: function (entry) {
                this.entry = compact(entry);
                this.sentences = null;
            },
            // Split the entry into sentences.
            getSentences: function () {
                // this.sentences = this.entry.split(/[\.!]\s/);
                if (!this.entry) return [];
                var words = this.entry.split(' ');
                var endingWords = words.filter(function (w) {
                    return w.endsWith('.') || w.endsWith('!') || w.endsWith('?');
                });

                var self = this;
                var botnameRegExp = new RegExp("\\W?" + self.botname.normalize() + "\\W?");
                var usernameRegExp = new RegExp("\\W?" + self.username.normalize() + "\\W?");
                var lastSentence = words[0];
                self.sentences = [];
                words.reduce(function (prev, cur) {
                    var curNormalized = cur.normalize();
                    var curReplaced = cur;
                    if (curNormalized.search(botnameRegExp) !== -1) {
                        curReplaced = cur.replace(self.botname, "{yourname}");
                    } else if (curNormalized.search(usernameRegExp) !== -1) {
                        curReplaced = cur.replace(self.username, "{myname}");
                    }

                    if (endingWords.indexOf(prev) != -1) {
                        self.sentences.push(compact(lastSentence));
                        lastSentence = "";
                    }
                    lastSentence = lastSentence + " " + curReplaced;
                    return cur;
                });
                self.sentences.push(compact(lastSentence));
                return this.sentences;
            },
            // Get the tokens of one sentence
            getTokens: function (sentenceIndex) {
                var s = 0;
                if (typeof sentenceIndex === 'number') s = sentenceIndex;
                return this.sentences[s].split(' ');
            }
        };

        module.exports = Tokenizer;
    }, { "debug": 9 }], 9: [function (require, module, exports) {
        (function (process) {
            /* eslint-env browser */

            /**
             * This is the web browser implementation of `debug()`.
             */

            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = localstorage();

            /**
             * Colors.
             */

            exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            // eslint-disable-next-line complexity
            function useColors() {
                // NB: In an Electron preload script, document will be defined but not fully
                // initialized. Since we know we're in Chrome, we'll just detect this case
                // explicitly
                if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
                    return true;
                }

                // Internet Explorer and Edge do not support colors.
                if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
                    return false;
                }

                // Is webkit? http://stackoverflow.com/a/16459606/376773
                // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
                return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
                    // Is firebug? http://stackoverflow.com/a/398120/376773
                    typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
                    // Is firefox >= v31?
                    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
                    // Double check webkit in userAgent just in case we are in a worker
                    typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */

            function formatArgs(args) {
                args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

                if (!this.useColors) {
                    return;
                }

                const c = 'color: ' + this.color;
                args.splice(1, 0, c, 'color: inherit');

                // The final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into
                let index = 0;
                let lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, match => {
                    if (match === '%%') {
                        return;
                    }
                    index++;
                    if (match === '%c') {
                        // We only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });

                args.splice(lastC, 0, c);
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */
            function log(...args) {
                // This hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return typeof console === 'object' && console.log && console.log(...args);
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */
            function save(namespaces) {
                try {
                    if (namespaces) {
                        exports.storage.setItem('debug', namespaces);
                    } else {
                        exports.storage.removeItem('debug');
                    }
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */
            function load() {
                let r;
                try {
                    r = exports.storage.getItem('debug');
                } catch (error) { }
                // Swallow
                // XXX (@Qix-) should we be logging these?


                // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
                if (!r && typeof process !== 'undefined' && 'env' in process) {
                    r = process.env.DEBUG;
                }

                return r;
            }

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
                    // The Browser also has localStorage in the global context.
                    return localStorage;
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            module.exports = require('./common')(exports);

            const { formatters } = module.exports;

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */

            formatters.j = function (v) {
                try {
                    return JSON.stringify(v);
                } catch (error) {
                    return '[UnexpectedJSONParseError]: ' + error.message;
                }
            };
        }).call(this, require('_process'));
    }, { "./common": 10, "_process": 1 }], 10: [function (require, module, exports) {

        /**
         * This is the common logic for both the Node.js and web browser
         * implementations of `debug()`.
         */

        function setup(env) {
            createDebug.debug = createDebug;
            createDebug.default = createDebug;
            createDebug.coerce = coerce;
            createDebug.disable = disable;
            createDebug.enable = enable;
            createDebug.enabled = enabled;
            createDebug.humanize = require('ms');

            Object.keys(env).forEach(key => {
                createDebug[key] = env[key];
            });

            /**
            * Active `debug` instances.
            */
            createDebug.instances = [];

            /**
            * The currently active debug mode names, and names to skip.
            */

            createDebug.names = [];
            createDebug.skips = [];

            /**
            * Map of special "%n" handling functions, for the debug "format" argument.
            *
            * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
            */
            createDebug.formatters = {};

            /**
            * Selects a color for a debug namespace
            * @param {String} namespace The namespace string for the for the debug instance to be colored
            * @return {Number|String} An ANSI color code for the given namespace
            * @api private
            */
            function selectColor(namespace) {
                let hash = 0;

                for (let i = 0; i < namespace.length; i++) {
                    hash = (hash << 5) - hash + namespace.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }

                return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
            }
            createDebug.selectColor = selectColor;

            /**
            * Create a debugger with the given `namespace`.
            *
            * @param {String} namespace
            * @return {Function}
            * @api public
            */
            function createDebug(namespace) {
                let prevTime;

                function debug(...args) {
                    // Disabled?
                    if (!debug.enabled) {
                        return;
                    }

                    const self = debug;

                    // Set `diff` timestamp
                    const curr = Number(new Date());
                    const ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;

                    args[0] = createDebug.coerce(args[0]);

                    if (typeof args[0] !== 'string') {
                        // Anything else let's inspect with %O
                        args.unshift('%O');
                    }

                    // Apply any `formatters` transformations
                    let index = 0;
                    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
                        // If we encounter an escaped % then don't increase the array index
                        if (match === '%%') {
                            return match;
                        }
                        index++;
                        const formatter = createDebug.formatters[format];
                        if (typeof formatter === 'function') {
                            const val = args[index];
                            match = formatter.call(self, val);

                            // Now we need to remove `args[index]` since it's inlined in the `format`
                            args.splice(index, 1);
                            index--;
                        }
                        return match;
                    });

                    // Apply env-specific formatting (colors, etc.)
                    createDebug.formatArgs.call(self, args);

                    const logFn = self.log || createDebug.log;
                    logFn.apply(self, args);
                }

                debug.namespace = namespace;
                debug.enabled = createDebug.enabled(namespace);
                debug.useColors = createDebug.useColors();
                debug.color = selectColor(namespace);
                debug.destroy = destroy;
                debug.extend = extend;
                // Debug.formatArgs = formatArgs;
                // debug.rawLog = rawLog;

                // env-specific initialization logic for debug instances
                if (typeof createDebug.init === 'function') {
                    createDebug.init(debug);
                }

                createDebug.instances.push(debug);

                return debug;
            }

            function destroy() {
                const index = createDebug.instances.indexOf(this);
                if (index !== -1) {
                    createDebug.instances.splice(index, 1);
                    return true;
                }
                return false;
            }

            function extend(namespace, delimiter) {
                return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
            }

            /**
            * Enables a debug mode by namespaces. This can include modes
            * separated by a colon and wildcards.
            *
            * @param {String} namespaces
            * @api public
            */
            function enable(namespaces) {
                createDebug.save(namespaces);

                createDebug.names = [];
                createDebug.skips = [];

                let i;
                const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                const len = split.length;

                for (i = 0; i < len; i++) {
                    if (!split[i]) {
                        // ignore empty strings
                        continue;
                    }

                    namespaces = split[i].replace(/\*/g, '.*?');

                    if (namespaces[0] === '-') {
                        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        createDebug.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }

                for (i = 0; i < createDebug.instances.length; i++) {
                    const instance = createDebug.instances[i];
                    instance.enabled = createDebug.enabled(instance.namespace);
                }
            }

            /**
            * Disable debug output.
            *
            * @return {String} namespaces
            * @api public
            */
            function disable() {
                const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
                createDebug.enable('');
                return namespaces;
            }

            /**
            * Returns true if the given mode name is enabled, false otherwise.
            *
            * @param {String} name
            * @return {Boolean}
            * @api public
            */
            function enabled(name) {
                if (name[name.length - 1] === '*') {
                    return true;
                }

                let i;
                let len;

                for (i = 0, len = createDebug.skips.length; i < len; i++) {
                    if (createDebug.skips[i].test(name)) {
                        return false;
                    }
                }

                for (i = 0, len = createDebug.names.length; i < len; i++) {
                    if (createDebug.names[i].test(name)) {
                        return true;
                    }
                }

                return false;
            }

            /**
            * Convert regexp to namespace
            *
            * @param {RegExp} regxep
            * @return {String} namespace
            * @api private
            */
            function toNamespace(regexp) {
                return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
            }

            /**
            * Coerce `val`.
            *
            * @param {Mixed} val
            * @return {Mixed}
            * @api private
            */
            function coerce(val) {
                if (val instanceof Error) {
                    return val.stack || val.message;
                }
                return val;
            }

            createDebug.enable(createDebug.load());

            return createDebug;
        }

        module.exports = setup;
    }, { "ms": 11 }], 11: [function (require, module, exports) {
        /**
         * Helpers.
         */

        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var w = d * 7;
        var y = d * 365.25;

        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} [options]
         * @throws {Error} throw an error if val is not a non-empty string or a number
         * @return {String|Number}
         * @api public
         */

        module.exports = function (val, options) {
            options = options || {};
            var type = typeof val;
            if (type === 'string' && val.length > 0) {
                return parse(val);
            } else if (type === 'number' && isNaN(val) === false) {
                return options.long ? fmtLong(val) : fmtShort(val);
            }
            throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };

        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */

        function parse(str) {
            str = String(str);
            if (str.length > 100) {
                return;
            }
            var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) {
                return;
            }
            var n = parseFloat(match[1]);
            var type = (match[2] || 'ms').toLowerCase();
            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtShort(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return Math.round(ms / d) + 'd';
            }
            if (msAbs >= h) {
                return Math.round(ms / h) + 'h';
            }
            if (msAbs >= m) {
                return Math.round(ms / m) + 'm';
            }
            if (msAbs >= s) {
                return Math.round(ms / s) + 's';
            }
            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtLong(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return plural(ms, msAbs, d, 'day');
            }
            if (msAbs >= h) {
                return plural(ms, msAbs, h, 'hour');
            }
            if (msAbs >= m) {
                return plural(ms, msAbs, m, 'minute');
            }
            if (msAbs >= s) {
                return plural(ms, msAbs, s, 'second');
            }
            return ms + ' ms';
        }

        /**
         * Pluralization helper.
         */

        function plural(ms, msAbs, n, name) {
            var isPlural = msAbs >= n * 1.5;
            return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
        }
    }, {}], 12: [function (require, module, exports) {
        module.exports = {
            compareTwoStrings,
            findBestMatch
        };

        function compareTwoStrings(str1, str2) {
            if (!str1.length && !str2.length) return 1; // if both are empty strings
            if (!str1.length || !str2.length) return 0; // if only one is empty string
            if (str1.toUpperCase() === str2.toUpperCase()) return 1; // identical
            if (str1.length === 1 && str2.length === 1) return 0; // both are 1-letter strings

            const pairs1 = wordLetterPairs(str1);
            const pairs2 = wordLetterPairs(str2);
            const union = pairs1.length + pairs2.length;
            let intersection = 0;
            pairs1.forEach(pair1 => {
                for (let i = 0, pair2; pair2 = pairs2[i]; i++) {
                    if (pair1 !== pair2) continue;
                    intersection++;
                    pairs2.splice(i, 1);
                    break;
                }
            });
            return intersection * 2 / union;
        }

        function findBestMatch(mainString, targetStrings) {
            if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
            const ratings = targetStrings.map(target => ({ target, rating: compareTwoStrings(mainString, target) }));
            const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
            return { ratings, bestMatch };
        }

        function flattenDeep(arr) {
            return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];
        }

        function areArgsValid(mainString, targetStrings) {
            if (typeof mainString !== 'string') return false;
            if (!Array.isArray(targetStrings)) return false;
            if (!targetStrings.length) return false;
            if (targetStrings.find(s => typeof s !== 'string')) return false;
            return true;
        }

        function letterPairs(str) {
            const pairs = [];
            for (let i = 0, max = str.length - 1; i < max; i++) pairs[i] = str.substring(i, i + 2);
            return pairs;
        }

        function wordLetterPairs(str) {
            const pairs = str.toUpperCase().split(' ').map(letterPairs);
            return flattenDeep(pairs);
        }
    }, {}], 13: [function (require, module, exports) {
        'use strict';

        function ToObject(val) {
            if (val == null) {
                throw new TypeError('Object.assign cannot be called with null or undefined');
            }

            return Object(val);
        }

        module.exports = Object.assign || function (target, source) {
            var from;
            var keys;
            var to = ToObject(target);

            for (var s = 1; s < arguments.length; s++) {
                from = arguments[s];
                keys = Object.keys(Object(from));

                for (var i = 0; i < keys.length; i++) {
                    to[keys[i]] = from[keys[i]];
                }
            }

            return to;
        };
    }, {}], 14: [function (require, module, exports) {
        var _ = {
            keys: require('object-keys'),
            values: require('object-values'),
            assign: require('object-assign'),
            uniq: require('uniq'),
            last: require('array-last'),
            compact: function (d) {
                return d.filter(function (d) {
                    return d;
                });
            }
        };

        module.exports = function (input) {
            var self = {},
                _tokens = {},
                _helpers = {},
                _input = input,
                _debug = false;

            self.input = function (input) {
                _input = input;
                return self;
            };

            self.token = function (token, pattern, helper) {
                var t = {};
                t[token] = pattern;
                addTokens(t);
                helper && self.helper(token, helper);
                return self;
            };

            self.helper = function (token, callback) {
                var m = {};
                m[token] = callback;
                addHelpers(m);
                return self;
            };

            self.debug = function () {
                return _debug = true, self;
            };

            self.tokens = addTokens;
            self.helpers = addHelpers;

            self.walk = walk;
            self.resolve = resolve;

            return self;

            function addTokens(token) {
                var names = _.keys(token),
                    expressions = _.values(token),
                    expression;

                expressions.forEach(function (d, i) {
                    expression = new RegExp('(' + getSource(d) + ')');
                    _tokens[expression.source] = names[i];
                });

                return self;

                function getSource(expression) {
                    if (is(expression, 'RegExp')) return expression.source;
                    return getSource(new RegExp(expression));
                }
            }

            function addHelpers(helpers) {
                for (var helper in helpers) _helpers[helper] = helpers[helper];
                return self;
            }

            function walk(onToken) {
                var cb = onToken || noop;

                var tokens = _.keys(_tokens) || [],
                    names = _.values(_tokens);

                if (tokens.length == 0) throw new Error('Define at least one token');

                runFrom(0);

                return self;

                //TODO: some house keeping needed ... ;)
                function runFrom(lastIndex, ignore) {

                    if (lastIndex > _input.length) return;

                    var expr,
                        _i = _input.substr(lastIndex),
                        idx = -1,
                        min = Infinity;

                    tokens.forEach(function (d, i) {
                        var _expr = new RegExp(d, 'g'),
                            _min;

                        _expr.lastIndex = lastIndex;
                        _min = ignore == i ? -1 : _i.search(_expr);

                        if (min > _min && _min > -1) {
                            expr = _expr;
                            min = _min;
                            idx = i;
                        }
                    });

                    if (idx == -1) return;

                    var part,
                        offset = (part = evalExpr()) && part.length > 0 ? part.lastIndex || part.index : -1,
                        match;

                    function evalExpr() {
                        var r = expr.exec(_input),
                            helper = _helpers[names[idx]];

                        if (helper && r) r.push(helper(r, _input, expr.source));
                        debug('tag %s, index %s, exec %s', names[idx], lastIndex, r);
                        return r;
                    }

                    match = part || [''];

                    offset += match[0].length;

                    var shouldSkip = cb(names[idx], topMatch(match), idx, lastIndex, _.uniq(_.compact(match)));
                    if (typeof shouldSkip != 'undefined' && !shouldSkip) return runFrom(offset - match[0].length, idx);

                    return runFrom(offset);
                }

                function topMatch(arr) {
                    return _.last(_.compact(arr));
                }
                function evaluateExpression(tokens) {
                    return new RegExp(tokens.join('|'), 'g');
                }
            }

            function resolve(postionInfo) {
                var r = {};

                walk(function (name, value, tokenIndex, position, rawExec) {
                    if (postionInfo) value = { value: value, position: position };

                    if (is(r[name], 'Array')) return r[name].push(value);
                    if (is(r[name], 'String')) return r[name] = [value].concat(r[name] || []).reverse();
                    if (is(r[name], 'Object')) return r[name] = _.assign(value, r[name]);

                    r[name] = r[name] || [];
                    r[name].push(value);
                });

                r._source = _input;

                return simplify(r);

                function simplify(r) {
                    for (var key in r) if (is(r[key], 'Array') && r[key].length == 1) r[key] = r[key][0];

                    return r;
                }
            }

            function noop() { }
            function is(expression, type) {
                return Object.prototype.toString.call(expression) == '[object ' + type + ']';
            }
            function debug() {
                if (_debug) console.log.apply(console, arguments);
            }
        };
    }, { "array-last": 3, "object-assign": 13, "object-keys": 5, "object-values": 7, "uniq": 15 }], 15: [function (require, module, exports) {
        "use strict";

        function unique_pred(list, compare) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i) {
                b = a;
                a = list[i];
                if (compare(a, b)) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique_eq(list) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i, b = a) {
                b = a;
                a = list[i];
                if (a !== b) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique(list, compare, sorted) {
            if (list.length === 0) {
                return list;
            }
            if (compare) {
                if (!sorted) {
                    list.sort(compare);
                }
                return unique_pred(list, compare);
            }
            if (!sorted) {
                list.sort();
            }
            return unique_eq(list);
        }

        module.exports = unique;
    }, {}], 16: [function (require, module, exports) {
        //     wink-bm25-text-search
        //     Fast Full Text Search based on BM25F
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-bm25-text-search”.
        //
        //     “wink-bm25-search” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-bm25-text-search” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-bm25-text-search”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');

        /* eslint guard-for-in: 0 */
        /* eslint complexity: [ "error", 25 ] */

        // It is a BM25F In-memory Search engine for text and exposes following
        // methods:
        // 1. `definePrepTasks` allows to define field-wise (optional) pipeline of
        // functions that will be used to prepare each input prior to *search/predict*
        // and *addDoc/learn*.
        // 2. `defineConfig` sets up the configuration for *field-wise weights*,
        // *BM25F parameters*, and **field names whoes original value** needs to be retained.
        // 3. `addDoc/learn` adds a document using its unique id. The document is supplied
        // as an Javascript object, where each property is the field of the document
        // and its value is the text.
        // 4. `consolidate` learnings prior to search/predict.
        // 5. `search/predict` searches for the input text and returns the resultant
        // document ids, sorted by their relevance along with the score. The number of
        // results returned can be controlled via a limit argument that defaults to **10**.
        // The last optional argument is a filter function that must return a `boolean`
        // value, which is used to filter documents.
        // 6. `exportJSON` exports the learnings in JSON format.
        // 7. `importJSON` imports the learnings from JSON that may have been saved on disk.
        // 8. `reset` all the learnings except the preparatory tasks.
        var bm25fIMS = function () {
            // Preparatory tasks that are executed on the `addDoc` & `search` input.
            var pTasks = [];
            // And its count.
            var pTaskCount;
            // Field level prep tasks.
            var flds = Object.create(null);
            // Returned!
            var methods = Object.create(null);
            // Term Frequencies & length of each document.
            var documents = Object.create(null);
            // Inverted Index for faster search
            var invertedIdx = [];
            // IDF for each tokens, tokens are referenced via their numerical index.
            var idf = [];
            // Set true on first call to `addDoc/learn` to prevent changing config.
            var learned = false;
            // The `addDoc()predict()` function checks for this being true; set
            // in `consolidate()`.
            var consolidated = false;
            // Total documents added.
            var totalDocs = 0;
            // Total number of tokens across all documents added.
            var totalCorpusLength = 0;
            // Their average.
            var avgCorpusLength = 0;
            // BM25F Configuration; set up in `defineConfig()`.
            var config = null;
            // The `token: index` mapping; `index` is used everywhere instead
            // of the `token`
            var token2Index = Object.create(null);
            // Index's initial value, incremented with every new word.
            var currTokenIndex = 0;

            // ### Private functions

            // #### Perpare Input

            // Prepares the `input` by executing the pipeline of tasks defined in the
            // `field` specific `pTasks` set via `definePrepTasks()`.
            // If `field` is not specified then default `pTasks` are used.
            // If the `field` specific `pTasks` are not defined then it automatically
            // switches to default `pTasks`.
            var prepareInput = function (input, field) {
                var processedInput = input;
                var pt = flds[field] && flds[field].pTasks || pTasks;
                var ptc = flds[field] && flds[field].pTaskCount || pTaskCount;
                for (var i = 0; i < ptc; i += 1) {
                    processedInput = pt[i](processedInput);
                }
                return processedInput;
            }; // prepareInput()

            // #### Update Freq

            // Updates the `freq` of each term in the `text` after pre-processing it via
            // `prepareInput()`; while updating, it takes care of `field's` `weight`.
            var updateFreq = function (id, text, weight, freq, field) {
                // Tokenized `text`.
                var tkns = prepareInput(text, field);
                // Temp token holder.
                var t;
                for (var i = 0, imax = tkns.length; i < imax; i += 1) {
                    t = tkns[i];
                    // Build `token: index` mapping.
                    if (token2Index[t] === undefined) {
                        token2Index[t] = currTokenIndex;
                        currTokenIndex += 1;
                    }
                    t = token2Index[t];
                    if (freq[t] === undefined) {
                        freq[t] = weight;
                        invertedIdx[t] = invertedIdx[t] || [];
                        invertedIdx[t].push(id);
                    } else {
                        freq[t] += weight;
                    }
                }
                // Length can not be negative!
                return tkns.length * Math.abs(weight);
            }; // updateFreq()

            // ### Exposed Functions

            // #### Define Prep Tasks

            // Defines the `tasks` required to prepare the input for `addDoc` and `search()`
            // The `tasks` should be an array of functions; using these function a simple
            // pipeline is built to serially transform the input to the output.
            // It validates the `tasks` before updating the `pTasks`.
            // If validation fails it throws an appropriate error.
            // Tasks can be defined separately for each field. However if the field is not
            // specified (i.e. `null` or `undefined`), then the `tasks` become default.
            // Note, `field = 'search'` is reserved for prep tasks for search string; However
            // if the same is not specified, the default tasks are used for pre-processing.
            var definePrepTasks = function (tasks, field) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before defining prepTasks.');
                }
                if (!helpers.array.isArray(tasks)) {
                    throw Error('winkBM25S: Tasks should be an array, instead found: ' + JSON.stringify(tasks));
                }
                for (var i = 0, imax = tasks.length; i < imax; i += 1) {
                    if (typeof tasks[i] !== 'function') {
                        throw Error('winkBM25S: Tasks should contain function, instead found: ' + typeof tasks[i]);
                    }
                }
                var fldWeights = config.fldWeights;
                if (field === undefined || field === null) {
                    pTasks = tasks;
                    pTaskCount = tasks.length;
                } else {
                    if (!fldWeights[field] || typeof field !== 'string') {
                        throw Error('winkBM25S: Field name is missing or it is not a string: ' + JSON.stringify(field) + '/' + typeof field);
                    }
                    flds[field] = flds[field] || Object.create(null);
                    flds[field].pTasks = tasks;
                    flds[field].pTaskCount = tasks.length;
                }
                return tasks.length;
            }; // definePrepTasks()

            // #### Define Config

            // Defines the configuration for BM25F using `fldWeights` and `bm25Params`
            // properties of `cfg` object.</br>
            // The `fldWeights` defines the weight for each field of the document. This gives
            // a semantic nudge to search and are used as a mutiplier to the count
            // (frequency) of each token contained in that field of the document. It should
            // be a JS object containing `field-name/value` pairs. If a field's weight is
            // not defined, that field is **ignored**. The field weights must be defined before
            // attempting to add a document via `addDoc()`; they can only be defined once.
            // If any document's field is not defined here then that field is **ignored**.
            // </br>
            // The `k`, `b` and `k1` properties of `bm25Params` object define the smoothing
            // factor for IDF, degree of normalization for TF, and saturation control factor
            // respectively for the BM25F. Their default values are **1**, **0.75**, and
            // **1.2**.<br/>
            // The `ovFieldNames` is an array of field names whose original value needs to
            // be retained.
            var defineConfig = function (cfg) {
                if (learned) {
                    throw Error('winkBM25S: config must be defined before learning/addition starts!');
                }
                if (!helpers.object.isObject(cfg)) {
                    throw Error('winkBM25S: config must be a config object, instead found: ' + JSON.stringify(cfg));
                }
                // If `fldWeights` are absent throw error.
                if (!helpers.object.isObject(cfg.fldWeights)) {
                    throw Error('winkBM25S: fldWeights must be an object, instead found: ' + JSON.stringify(cfg.fldWeights));
                }
                // There should be at least one defined field!
                if (helpers.object.keys(cfg.fldWeights).length === 0) {
                    throw Error('winkBM25S: Field config has no field defined.');
                }
                // Setup configuration now.
                config = Object.create(null);
                // Field config for BM25**F**
                config.fldWeights = Object.create(null);
                config.bm25Params = Object.create(null);
                // **Controls TF part:**<br/>
                // `k1` controls saturation of token's frequency; higher value delays saturation
                // with increase in frequency.
                config.bm25Params.k1 = 1.2;
                // `b` controls the degree of normalization; **0** means no normalization and **1**
                // indicates complete normalization!
                config.bm25Params.b = 0.75;
                // **Controls IDF part:**<br/>
                // `k` controls impact of IDF; should be >= 0; a higher value means lower
                // the impact of IDF.
                config.bm25Params.k = 1;
                // Setup field weights.
                for (var field in cfg.fldWeights) {
                    // The `null` check is required as `isNaN( null )` returns `false`!!
                    // This first ensures non-`null/undefined/0` values before testing for NaN.
                    if (!cfg.fldWeights[field] || isNaN(cfg.fldWeights[field])) {
                        throw Error('winkBM25S: Field weight should be number >0, instead found: ' + JSON.stringify(cfg.fldWeights[field]));
                    }
                    // Update config parameters from `cfg`.
                    config.fldWeights[field] = +cfg.fldWeights[field];
                }
                // Setup BM25F params.
                // Create `bm25Params` if absent in `cfg`.
                if (!helpers.object.isObject(cfg.bm25Params)) cfg.bm25Params = Object.create(null);
                // Update config parameters from `cfg`.
                config.bm25Params.b = cfg.bm25Params.b === null || cfg.bm25Params.b === undefined || isNaN(cfg.bm25Params.b) || +cfg.bm25Params.b < 0 || +cfg.bm25Params.b > 1 ? 0.75 : +cfg.bm25Params.b;

                // Update config parameters from `cfg`.
                config.bm25Params.k1 = cfg.bm25Params.k1 === null || cfg.bm25Params.k1 === undefined || isNaN(cfg.bm25Params.k1) || +cfg.bm25Params.k1 < 0 ? 1.2 : +cfg.bm25Params.k1;

                // Update config parameters from `cfg`.
                config.bm25Params.k = cfg.bm25Params.k === null || cfg.bm25Params.k === undefined || isNaN(cfg.bm25Params.k) || +cfg.bm25Params.k < 0 ? 1 : +cfg.bm25Params.k;

                // Handle configuration for fields whose orginal values has to be retained
                // in the document.<br/>
                // Initialize the `ovFldNames` in the final `config` as an empty array
                config.ovFldNames = [];
                if (!cfg.ovFldNames) cfg.ovFldNames = [];
                if (!helpers.array.isArray(cfg.ovFldNames)) {
                    throw Error('winkBM25S: OV Field names should be an array, instead found: ' + JSON.stringify(typeof cfg.ovFldNames));
                }

                cfg.ovFldNames.forEach(function (f) {
                    if (typeof f !== 'string' || f.length === 0) {
                        throw Error('winkBM25S: OV Field name should be a non-empty string, instead found: ' + JSON.stringify(f));
                    }
                    config.ovFldNames.push(f);
                });
                return true;
            }; // defineConfig()


            // #### Add Doc

            // Adds a document to the model using `updateFreq()` function.
            var addDoc = function (doc, id) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before adding a document.');
                }
                var fldWeights = config.fldWeights;
                // No point in adding/learning further in absence of consolidated.
                if (consolidated) {
                    throw Error('winkBM25S: post consolidation adding/learning is not possible!');
                }
                // Set learning/addition started.
                learned = true;
                var length;
                if (documents[id] !== undefined) {
                    throw Error('winkBM25S: Duplicate document encountered: ' + JSON.stringify(id));
                }
                documents[id] = Object.create(null);
                documents[id].freq = Object.create(null);
                documents[id].fieldValues = Object.create(null);
                documents[id].length = 0;
                // Compute `freq` & `length` of the specified fields.
                for (var field in fldWeights) {
                    if (doc[field] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(field));
                    }
                    length = updateFreq(id, doc[field], fldWeights[field], documents[id].freq, field);
                    documents[id].length += length;
                    totalCorpusLength += length;
                }
                // Retain Original Field Values, if configured.
                config.ovFldNames.forEach(function (f) {
                    if (doc[f] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(f));
                    }
                    documents[id].fieldValues[f] = doc[f];
                });
                // Increment total documents indexed so far.
                totalDocs += 1;
                return totalDocs;
            }; // addDoc()

            // #### Consolidate

            // Consolidates the data structure of bm25 and computes the IDF. This must be
            // built before using the `search` function. The `fp` defines the precision at
            // which term frequency values are stored. The default value is **4**. In cause
            // of an invalid input, it default to 4. The maximum permitted value is 9; any
            // value larger than 9 is forced to 9.
            var consolidate = function (fp) {
                if (consolidated) {
                    throw Error('winkBM25S: consolidation can be carried out only once!');
                }
                if (totalDocs < 3) {
                    throw Error('winkBM25S: document collection is too small for consolidation; add more docs!');
                }
                var freqPrecision = parseInt(fp, 10);
                freqPrecision = isNaN(freqPrecision) ? 4 : freqPrecision < 4 ? 4 : freqPrecision > 9 ? 9 : freqPrecision;
                // Using the commonly used names but unfortunately they are very cryptic and
                // *short*. **Must not use these variable names elsewhere**.
                var b = config.bm25Params.b;
                var k1 = config.bm25Params.k1;
                var k = config.bm25Params.k;
                var freq, id, n, normalizationFactor, t;
                // Consolidate: compute idf; will multiply with freq to save multiplication
                // time during search. This happens in the next loop-block.
                for (var i = 0, imax = invertedIdx.length; i < imax; i += 1) {
                    n = invertedIdx[i].length;
                    idf[i] = Math.log((totalDocs - n + 0.5) / (n + 0.5) + k);
                    // To be uncommented to probe values!
                    // console.log( '%s, %d, %d, %d, %d', t, totalDocs, n, k, idf[ t ] );
                }
                avgCorpusLength = totalCorpusLength / totalDocs;
                // Consolidate: update document frequencies.
                for (id in documents) {
                    normalizationFactor = 1 - b + b * (documents[id].length / avgCorpusLength);
                    for (t in documents[id].freq) {
                        freq = documents[id].freq[t];
                        // Update frequency but ensure the sign is carefully preserved as the
                        // magnitude of `k1` can jeopardize the sign!
                        documents[id].freq[t] = Math.sign(freq) * (Math.abs(freq * (k1 + 1) / (k1 * normalizationFactor + freq)) * idf[t]).toFixed(freqPrecision);
                        // To be uncommented to probe values!
                        // console.log( '%s, %s, %d', id, t, documents[ id ].freq[ t ] );
                    }
                }
                // Set `consolidated` as `true`.
                consolidated = true;
                return true;
            }; // consolidate()

            // #### Search

            // Searches the `text` and return `limit` results. If `limit` is not sepcified
            // then it will return a maximum of **10** results. The `result` is an array of
            // containing `doc id` and `score` pairs array. If the `text` is not found, an
            // empty array is returned. The `text` must be a string. The argurment `filter`
            // is like `filter` of JS Array; it receive an object containing document's
            // retained field name/value pairs along with the `params` (which is passed as
            // the second argument). It is useful in limiting the search space or making the
            // search more focussed.
            var search = function (text, limit, filter, params) {
                // Predict/Search only if learnings have been consolidated!
                if (!consolidated) {
                    throw Error('winkBM25S: search is not possible unless learnings are consolidated!');
                }
                if (typeof text !== 'string') {
                    throw Error('winkBM25S: search text should be a string, instead found: ' + typeof text);
                }
                // Setup filter function
                var f = typeof filter === 'function' ? filter : function () {
                    return true;
                };
                // Tokenized `text`. Use search specific weights.
                var tkns = prepareInput(text, 'search')
                    // Filter out tokens that do not exists in the vocabulary.
                    .filter(function (t) {
                        return token2Index[t] !== undefined;
                    })
                    // Now map them to their respective indexes using `token2Index`.
                    .map(function (t) {
                        return token2Index[t];
                    });
                // Search results go here as doc id/score pairs.
                var results = Object.create(null);
                // Helper variables.
                var id, ids, t;
                var i, imax, j, jmax;
                // Iterate for every token in the preapred text.
                for (j = 0, jmax = tkns.length; j < jmax; j += 1) {
                    t = tkns[j];
                    // Use Inverted Idx to look up - accelerates search!<br/>
                    // Note, `ids` can never be `undefined` as **unknown** tokens have already
                    // been filtered.
                    ids = invertedIdx[t];
                    // Means the token exists in the vocabulary!
                    // Compute scores for every document.
                    for (i = 0, imax = ids.length; i < imax; i += 1) {
                        id = ids[i];
                        if (f(documents[id].fieldValues, params)) {
                            results[id] = documents[id].freq[t] + (results[id] || 0);
                        }
                        // To be uncommented to probe values!
                        /* console.log( '%s, %d, %d, %d', t, documents[ id ].freq[ t ], idf[ t ], results[ id ] ); */
                    }
                }
                // Convert to a table in `[ id, score ]` format; sort and slice required number
                // of resultant documents.
                return helpers.object.table(results).sort(helpers.array.descendingOnValue).slice(0, Math.max(limit || 10, 1));
            }; // search()

            // #### Reset

            // Resets the BM25F completely by re-initializing all the learning
            // related variables, except the preparatory tasks.
            var reset = function () {
                // Reset values of variables that are associated with learning; Therefore
                // `pTasks` & `pTaskCount` are not re-initialized.
                // Term Frequencies & length of each document.
                documents = Object.create(null);
                // Inverted Index for faster search
                invertedIdx = [];
                // IDF for each tokens
                idf = [];
                // Set true on first call to `addDoc/learn` to prevent changing config.
                learned = false;
                // The `addDoc()predict()` function checks for this being true; set
                // in `consolidate()`.
                consolidated = false;
                // Total documents added.
                totalDocs = 0;
                // Total number of tokens across all documents added.
                totalCorpusLength = 0;
                // Their average.
                avgCorpusLength = 0;
                // BM25F Configuration; set up in `defineConfig()`.
                config = null;
                // The `token: index` mapping; `index` is used everywhere instead
                // of the `token`
                token2Index = Object.create(null);
                // Index's initial value, incremented with every new word.
                currTokenIndex = 0;
                return true;
            }; // reset()

            // #### Export JSON

            // Returns the learnings, along with `consolidated` flag, in JSON format.
            var exportJSON = function () {
                var docStats = Object.create(null);
                docStats.totalCorpusLength = totalCorpusLength;
                docStats.totalDocs = totalDocs;
                docStats.consolidated = consolidated;
                return JSON.stringify([config, docStats, documents, invertedIdx, currTokenIndex, token2Index,
                    // For future expansion but the import will have to have intelligence to
                    // set the default values and still ensure nothing breaks! Hopefully!!
                    {}, [], []]);
            }; // exportJSON()

            // #### Import JSON

            // Imports the `json` in to index after validating the format of input JSON.
            // If validation fails then throws error; otherwise on success import it
            // returns `true`. Note, importing leads to resetting the search engine.
            var importJSON = function (json) {
                if (!json) {
                    throw Error('winkBM25S: undefined or null JSON encountered, import failed!');
                }
                // Validate json format
                var isOK = [helpers.object.isObject, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, Number.isInteger, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, helpers.array.isArray];
                var parsedJSON = JSON.parse(json);
                if (!helpers.array.isArray(parsedJSON) || parsedJSON.length !== isOK.length) {
                    throw Error('winkBM25S: invalid JSON encountered, can not import.');
                }
                for (var i = 0; i < isOK.length; i += 1) {
                    if (!isOK[i](parsedJSON[i])) {
                        throw Error('winkBM25S: invalid JSON encountered, can not import.');
                    }
                }
                // All good, setup variable values.
                // First reset everything.
                reset();
                // To prevent config change.
                learned = true;
                // Load variable values.
                config = parsedJSON[0];
                totalCorpusLength = parsedJSON[1].totalCorpusLength;
                totalDocs = parsedJSON[1].totalDocs;
                consolidated = parsedJSON[1].consolidated;
                documents = parsedJSON[2];
                invertedIdx = parsedJSON[3];
                currTokenIndex = parsedJSON[4];
                token2Index = parsedJSON[5];
                // Return success.
                return true;
            }; // importJSON()

            methods.definePrepTasks = definePrepTasks;
            methods.defineConfig = defineConfig;
            methods.addDoc = addDoc;
            methods.consolidate = consolidate;
            methods.search = search;
            methods.exportJSON = exportJSON;
            methods.importJSON = importJSON;
            methods.reset = reset;
            // Aliases to keep APIs uniform across.
            methods.learn = addDoc;
            methods.predict = search;

            return methods;
        }; // bm25fIMS()

        module.exports = bm25fIMS;
    }, { "wink-helpers": 17 }], 17: [function (require, module, exports) {
        //     wink-helpers
        //     Low level helper functions for Javascript
        //     array, object, and string.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-helpers”.
        //
        //     “wink-helpers” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-helpers” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-helpers”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = Object.create(null);

        // ### Private Functions

        // #### Product Reducer (Callback)

        // Callback function used by `reduce` inside the `product()` function.
        // Follows the standard guidelines of `reduce()` callback function.
        var productReducer = function (prev, curr) {
            var c,
                cmax = curr.length;
            var p,
                pmax = prev.length;
            var result = [];

            for (p = 0; p < pmax; p += 1) {
                for (c = 0; c < cmax; c += 1) {
                    result.push(prev[p].concat(curr[c]));
                }
            }
            return result;
        }; // productReducer()

        // ### Public Function

        // ### Array Helpers

        helpers.array = Object.create(null);

        // #### is Array

        // Tests if argument `v` is a JS array; returns `true` if it is, otherwise returns `false`.
        helpers.array.isArray = function (v) {
            return v !== undefined && v !== null && Object.prototype.toString.call(v) === '[object Array]';
        }; // isArray()


        // #### sorting helpers

        // Set of helpers to sort either numbers or strings. For key/value pairs,
        // the format for each element must be `[ key, value ]`.
        // Sort helper to sort an array in ascending order.
        helpers.array.ascending = function (a, b) {
            return a > b ? 1 : a === b ? 0 : -1;
        }; // ascending()

        // Sort helper to sort an array in descending order.
        helpers.array.descending = function (a, b) {
            return b > a ? 1 : b === a ? 0 : -1;
        }; // descending()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **key**.
        helpers.array.ascendingOnKey = function (a, b) {
            return a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1;
        }; // ascendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **key**.
        helpers.array.descendingOnKey = function (a, b) {
            return b[0] > a[0] ? 1 : b[0] === a[0] ? 0 : -1;
        }; // descendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **value**.
        helpers.array.ascendingOnValue = function (a, b) {
            return a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1;
        }; // ascendingOnValue()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **value**.
        helpers.array.descendingOnValue = function (a, b) {
            return b[1] > a[1] ? 1 : b[1] === a[1] ? 0 : -1;
        }; // descendingOnValue()

        // The following two functions generate a suitable function for sorting on a single
        // key or on a composite keys (max 2 only). Just a remider, the generated function
        // does not sort on two keys; instead it will sort on a key composed of the two
        // accessors.
        // Sorts in ascending order on `accessor1` & `accessor2` (optional).
        helpers.array.ascendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return a[accessor1][accessor2] > b[accessor1][accessor2] ? 1 : a[accessor1][accessor2] === b[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return a[accessor1] > b[accessor1] ? 1 : a[accessor1] === b[accessor1] ? 0 : -1;
            };
        }; // ascendingOn()

        // Sorts in descending order on `accessor1` & `accessor2` (optional).
        helpers.array.descendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return b[accessor1][accessor2] > a[accessor1][accessor2] ? 1 : b[accessor1][accessor2] === a[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return b[accessor1] > a[accessor1] ? 1 : b[accessor1] === a[accessor1] ? 0 : -1;
            };
        }; // descendingOn()

        // #### pluck

        // Plucks specified element from each element of an **array of array**, and
        // returns the resultant array. The element is specified by `i` (default `0`) and
        // number of elements to pluck are defined by `limit` (default `a.length`).
        helpers.array.pluck = function (a, key, limit) {
            var k, plucked;
            k = a.length;
            var i = key || 0;
            var lim = limit || k;
            if (lim > k) lim = k;
            plucked = new Array(lim);
            for (k = 0; k < lim; k += 1) plucked[k] = a[k][i];
            return plucked;
        }; // pluck()

        // #### product

        // Finds the Cartesian Product of arrays present inside the array `a`. Therefore
        // the array `a` must be an array of 1-dimensional arrays. For example,
        // `product( [ [ 9, 8 ], [ 1, 2 ] ] )`
        // will produce `[ [ 9, 1 ], [ 9, 2 ], [ 8, 1 ], [ 8, 2 ] ]`.
        helpers.array.product = function (a) {
            return a.reduce(productReducer, [[]]);
        };

        // #### shuffle

        // Randomly shuffles the elements of an array and returns the same.
        // Reference: Chapter on Random Numbers/Shuffling in Seminumerical algorithms.
        // The Art of Computer Programming Volume II by Donald E Kunth
        helpers.array.shuffle = function (array) {
            var a = array;
            var balance = a.length;
            var candidate;
            var temp;

            while (balance) {
                candidate = Math.floor(Math.random() * balance);
                balance -= 1;

                temp = a[balance];
                a[balance] = a[candidate];
                a[candidate] = temp;
            }

            return a;
        };

        // ### Object Helpers

        var objectKeys = Object.keys;
        var objectCreate = Object.create;

        helpers.object = Object.create(null);

        // #### is Object

        // Tests if argument `v` is a JS object; returns `true` if it is, otherwise returns `false`.
        helpers.object.isObject = function (v) {
            return v && Object.prototype.toString.call(v) === '[object Object]' ? true : false; // eslint-disable-line no-unneeded-ternary
        }; // isObject()

        // #### keys

        // Returns keys of the `obj` in an array.
        helpers.object.keys = function (obj) {
            return objectKeys(obj);
        }; // keys()

        // #### size

        // Returns the number of keys of the `obj`.
        helpers.object.size = function (obj) {
            return objectKeys(obj).length;
        }; // size()

        // #### values

        // Returns all values from each key/value pair of the `obj` in an array.
        helpers.object.values = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var values = new Array(length);
            for (var i = 0; i < length; i += 1) {
                values[i] = obj[keys[i]];
            }
            return values;
        }; // values()

        // #### value Freq

        // Returns the frequency of each unique value present in the `obj`, where the
        // **key** is the *value* and **value** is the *frequency*.
        helpers.object.valueFreq = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var val;
            var vf = objectCreate(null);
            for (var i = 0; i < length; i += 1) {
                val = obj[keys[i]];
                vf[val] = 1 + (vf[val] || 0);
            }
            return vf;
        }; // valueFreq()

        // #### table

        // Converts the `obj` in to an array of `[ key, value ]` pairs in form of a table.
        // Second argument - `f` is optional and it is a function, which is called with
        // each `value`.
        helpers.object.table = function (obj, f) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var pairs = new Array(length);
            var ak, av;
            for (var i = 0; i < length; i += 1) {
                ak = keys[i];
                av = obj[ak];
                if (typeof f === 'function') f(av);
                pairs[i] = [ak, av];
            }
            return pairs;
        }; // table()

        // ### Validation Helpers

        helpers.validate = Object.create(null);

        // Create aliases for isObject and isArray.
        helpers.validate.isObject = helpers.object.isObject;
        helpers.validate.isArray = helpers.array.isArray;

        // #### isFiniteInteger

        // Validates if `n` is a finite integer.
        helpers.validate.isFiniteInteger = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n) && n === Math.round(n);
        }; // isFiniteInteger()

        // #### isFiniteNumber

        // Validates if `n` is a valid number.
        helpers.validate.isFiniteNumber = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n);
        }; // isFiniteNumber()

        // ### cross validation
        /**
         *
         * Creates an instance of cross validator useful for machine learning tasks.
         *
         * @param {string[]} classLabels - array containing all the class labels.
         * @return {methods} object conatining set of API methods for tasks like evalutaion,
         * reset and metrics generation.
        */
        helpers.validate.cross = function (classLabels) {
            // wink's const for unknown predictions!
            const unknown = 'unknown';
            // To ensure that metrics is not computed prior to evaluation.
            var evaluated = false;
            // The confusion matrix.
            var cm;
            var precision;
            var recall;
            var fmeasure;

            // The class labels is assigned to this variable.
            var labels;
            // The length of `labels` array.
            var labelCount;
            var labelsObj = Object.create(null);

            // Returned!
            var methods = Object.create(null);

            /**
             *
             * Resets the current instance for another round of evaluation; the class
             * labels defined at instance creation time are not touched.
             *
             * @return {undefined} nothing!
            */
            var reset = function () {
                evaluated = false;
                cm = Object.create(null);
                precision = Object.create(null);
                recall = Object.create(null);
                fmeasure = Object.create(null);

                // Initialize confusion matrix and metrics.
                for (let i = 0; i < labelCount; i += 1) {
                    const row = labels[i];
                    labelsObj[row] = true;
                    cm[row] = Object.create(null);
                    precision[row] = 0;
                    recall[row] = 0;
                    fmeasure[row] = 0;
                    for (let j = 0; j < labelCount; j += 1) {
                        const col = labels[j];
                        cm[row][col] = 0;
                    }
                }
            }; // reset()

            /**
             *
             * Creates an instance of cross validator useful for machine learning tasks.
             *
             * @param {string} truth - the actual class label.
             * @param {string} guess - the predicted class label.
             * @return {boolean} returns true if the evaluation is successful. The evaluation
             * may fail if `truth` or `guess` is not in the array `classLabels` provided at
             * instance creation time; or if guess is equal to `unknown`.
            */
            var evaluate = function (truth, guess) {
                // If prediction failed then return false!
                if (guess === unknown || !labelsObj[truth] || !labelsObj[guess]) return false;
                // Update confusion matrix.
                if (guess === truth) {
                    cm[truth][guess] += 1;
                } else {
                    cm[guess][truth] += 1;
                }
                evaluated = true;
                return true;
            }; // evaluate()

            /**
             *
             * It computes a detailed metrics consisting of macro-averaged precision,
             * recall and f-measure along with their label-wise values and the confusion
             * matrix.
             *
             * @return {object} object containing macro-averaged `avgPrecision`, `avgRecall`,
             * `avgFMeasure` values along with other details such as label-wise values
             * and the confusion matrix. A value of `null` is returned if no evaluate()
             * has been called before.
            */
            var metrics = function () {
                if (!evaluated) return null;
                // Numerators for every label; they are same for precision & recall both.
                var n = Object.create(null);
                // Only denominators differs for precision & recall
                var pd = Object.create(null);
                var rd = Object.create(null);
                // `row` and `col` of confusion matrix.
                var col, row;
                var i, j;
                // Macro average values for metrics.
                var avgPrecision = 0;
                var avgRecall = 0;
                var avgFMeasure = 0;

                // Compute label-wise numerators & denominators!
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    for (j = 0; j < labelCount; j += 1) {
                        col = labels[j];
                        if (row === col) {
                            n[row] = cm[row][col];
                        }
                        pd[row] = cm[row][col] + (pd[row] || 0);
                        rd[row] = cm[col][row] + (rd[row] || 0);
                    }
                }
                // Ready to compute metrics.
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    precision[row] = +(n[row] / pd[row]).toFixed(4);
                    // NaN can occur if a label has not been encountered.
                    if (isNaN(precision[row])) precision[row] = 0;

                    recall[row] = +(n[row] / rd[row]).toFixed(4);
                    if (isNaN(recall[row])) recall[row] = 0;

                    fmeasure[row] = +(2 * precision[row] * recall[row] / (precision[row] + recall[row])).toFixed(4);
                    if (isNaN(fmeasure[row])) fmeasure[row] = 0;
                }
                // Compute thier averages, note they will be macro avegages.
                for (i = 0; i < labelCount; i += 1) {
                    avgPrecision += precision[labels[i]] / labelCount;
                    avgRecall += recall[labels[i]] / labelCount;
                    avgFMeasure += fmeasure[labels[i]] / labelCount;
                }
                // Return metrics.
                return {
                    // Macro-averaged metrics.
                    avgPrecision: +avgPrecision.toFixed(4),
                    avgRecall: +avgRecall.toFixed(4),
                    avgFMeasure: +avgFMeasure.toFixed(4),
                    details: {
                        // Confusion Matrix.
                        confusionMatrix: cm,
                        // Label wise metrics details, from those averages were computed.
                        precision: precision,
                        recall: recall,
                        fmeasure: fmeasure
                    }
                };
            }; // metrics()

            if (!helpers.validate.isArray(classLabels)) {
                throw Error('cross validate: class labels must be an array.');
            }
            if (classLabels.length < 2) {
                throw Error('cross validate: at least 2 class labels are required.');
            }
            labels = classLabels;
            labelCount = labels.length;

            reset();

            methods.reset = reset;
            methods.evaluate = evaluate;
            methods.metrics = metrics;

            return methods;
        }; // cross()

        // ### Object Helpers

        helpers.string = Object.create(null);

        // Regex for [diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) removal.
        var rgxDiacritical = /[\u0300-\u036f]/g;

        /**
         *
         * Normalizes the token's value by converting it to lower case and stripping
         * the diacritical marks (if any).
         *
         * @param {string} str — that needs to be normalized.
         * @return {string} the normalized value.
         * @example
         * normalize( 'Nestlé' );
         * // -> nestle
        */
        helpers.string.normalize = function (str) {
            return str.toLowerCase().normalize('NFD').replace(rgxDiacritical, '');
        }; // normalize()

        module.exports = helpers;
    }, {}], 18: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        var contractions = Object.create(null);

        // Tag - word.
        var word = 'word';
        // Verbs.
        contractions['can\'t'] = [{ value: 'ca', tag: word }, { value: 'n\'t', tag: word }];
        contractions['CAN\'T'] = [{ value: 'CA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Can\'t'] = [{ value: 'Ca', tag: word }, { value: 'n\'t', tag: word }];

        contractions['Couldn\'t'] = [{ value: 'could', tag: word }, { value: 'n\'t', tag: word }];
        contractions['COULDN\'T'] = [{ value: 'COULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Couldn\'t'] = [{ value: 'Could', tag: word }, { value: 'n\'t', tag: word }];

        contractions['don\'t'] = [{ value: 'do', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DON\'T'] = [{ value: 'DO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Don\'t'] = [{ value: 'Do', tag: word }, { value: 'n\'t', tag: word }];

        contractions['doesn\'t'] = [{ value: 'does', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DOESN\'T'] = [{ value: 'DOES', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Doesn\'t'] = [{ value: 'Does', tag: word }, { value: 'n\'t', tag: word }];

        contractions['didn\'t'] = [{ value: 'did', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DIDN\'T'] = [{ value: 'DID', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Didn\'t'] = [{ value: 'Did', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hadn\'t'] = [{ value: 'had', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HADN\'T'] = [{ value: 'HAD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hadn\'t'] = [{ value: 'Had', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mayn\'t'] = [{ value: 'may', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MAYN\'T'] = [{ value: 'MAY', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mayn\'t'] = [{ value: 'May', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mightn\'t'] = [{ value: 'might', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MIGHTN\'T'] = [{ value: 'MIGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mightn\'t'] = [{ value: 'Might', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mustn\'t'] = [{ value: 'must', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MUSTN\'T'] = [{ value: 'MUST', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mustn\'t'] = [{ value: 'Must', tag: word }, { value: 'n\'t', tag: word }];

        contractions['needn\'t'] = [{ value: 'need', tag: word }, { value: 'n\'t', tag: word }];
        contractions['NEEDN\'T'] = [{ value: 'NEED', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Needn\'t'] = [{ value: 'Need', tag: word }, { value: 'n\'t', tag: word }];

        contractions['oughtn\'t'] = [{ value: 'ought', tag: word }, { value: 'n\'t', tag: word }];
        contractions['OUGHTN\'T'] = [{ value: 'OUGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Oughtn\'t'] = [{ value: 'Ought', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shan\'t'] = [{ value: 'sha', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHAN\'T'] = [{ value: 'SHA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shan\'t'] = [{ value: 'Sha', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shouldn\'t'] = [{ value: 'should', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHOULDN\'T'] = [{ value: 'SHOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shouldn\'t'] = [{ value: 'Should', tag: word }, { value: 'n\'t', tag: word }];

        contractions['won\'t'] = [{ value: 'wo', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WON\'T'] = [{ value: 'WO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Won\'t'] = [{ value: 'Wo', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wouldn\'t'] = [{ value: 'would', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WOULDN\'T'] = [{ value: 'WOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wouldn\'t'] = [{ value: 'Would', tag: word }, { value: 'n\'t', tag: word }];

        contractions['ain\'t'] = [{ value: 'ai', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AIN\'T'] = [{ value: 'AI', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Ain\'t'] = [{ value: 'Ai', tag: word }, { value: 'n\'t', tag: word }];

        contractions['aren\'t'] = [{ value: 'are', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AREN\'T'] = [{ value: 'ARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Aren\'t'] = [{ value: 'Are', tag: word }, { value: 'n\'t', tag: word }];

        contractions['isn\'t'] = [{ value: 'is', tag: word }, { value: 'n\'t', tag: word }];
        contractions['ISN\'T'] = [{ value: 'IS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Isn\'t'] = [{ value: 'Is', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wasn\'t'] = [{ value: 'was', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WASN\'T'] = [{ value: 'WAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wasn\'t'] = [{ value: 'Was', tag: word }, { value: 'n\'t', tag: word }];

        contractions['weren\'t'] = [{ value: 'were', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WEREN\'T'] = [{ value: 'WERE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Weren\'t'] = [{ value: 'Were', tag: word }, { value: 'n\'t', tag: word }];

        contractions['haven\'t'] = [{ value: 'have', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HAVEN\'T'] = [{ value: 'HAVE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Haven\'t'] = [{ value: 'Have', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hasn\'t'] = [{ value: 'has', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HASN\'T'] = [{ value: 'HAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hasn\'t'] = [{ value: 'Has', tag: word }, { value: 'n\'t', tag: word }];

        contractions['daren\'t'] = [{ value: 'dare', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DAREN\'T'] = [{ value: 'DARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Daren\'t'] = [{ value: 'Dare', tag: word }, { value: 'n\'t', tag: word }];

        // Pronouns like I, you, they, we, she, and he.
        contractions['i\'m'] = [{ value: 'i', tag: word }, { value: '\'m', tag: word }];
        contractions['I\'M'] = [{ value: 'I', tag: word }, { value: '\'M', tag: word }];
        contractions['I\'m'] = [{ value: 'I', tag: word }, { value: '\'m', tag: word }];

        contractions['i\'ve'] = [{ value: 'i', tag: word }, { value: '\'ve', tag: word }];
        contractions['I\'VE'] = [{ value: 'I', tag: word }, { value: '\'VE', tag: word }];
        contractions['I\'ve'] = [{ value: 'I', tag: word }, { value: '\'ve', tag: word }];

        contractions['i\'d'] = [{ value: 'i', tag: word }, { value: '\'d', tag: word }];
        contractions['I\'D'] = [{ value: 'I', tag: word }, { value: '\'D', tag: word }];
        contractions['I\'d'] = [{ value: 'I', tag: word }, { value: '\'d', tag: word }];

        contractions['i\'ll'] = [{ value: 'i', tag: word }, { value: '\'ll', tag: word }];
        contractions['I\'LL'] = [{ value: 'I', tag: word }, { value: '\'LL', tag: word }];
        contractions['I\'ll'] = [{ value: 'I', tag: word }, { value: '\'ll', tag: word }];

        contractions['you\'ve'] = [{ value: 'you', tag: word }, { value: '\'ve', tag: word }];
        contractions['YOU\'VE'] = [{ value: 'YOU', tag: word }, { value: '\'VE', tag: word }];
        contractions['You\'ve'] = [{ value: 'You', tag: word }, { value: '\'ve', tag: word }];

        contractions['you\'d'] = [{ value: 'you', tag: word }, { value: '\'d', tag: word }];
        contractions['YOU\'D'] = [{ value: 'YOU', tag: word }, { value: '\'D', tag: word }];
        contractions['You\'d'] = [{ value: 'You', tag: word }, { value: '\'d', tag: word }];

        contractions['you\'ll'] = [{ value: 'you', tag: word }, { value: '\'ll', tag: word }];
        contractions['YOU\'LL'] = [{ value: 'YOU', tag: word }, { value: '\'LL', tag: word }];
        contractions['You\'ll'] = [{ value: 'You', tag: word }, { value: '\'ll', tag: word }];

        // they - 've, 'd, 'll, 're
        contractions['they\'ve'] = [{ value: 'they', tag: word }, { value: '\'ve', tag: word }];
        contractions['THEY\'VE'] = [{ value: 'THEY', tag: word }, { value: '\'VE', tag: word }];
        contractions['They\'ve'] = [{ value: 'They', tag: word }, { value: '\'ve', tag: word }];

        contractions['they\'d'] = [{ value: 'they', tag: word }, { value: '\'d', tag: word }];
        contractions['THEY\'D'] = [{ value: 'THEY', tag: word }, { value: '\'D', tag: word }];
        contractions['They\'d'] = [{ value: 'They', tag: word }, { value: '\'d', tag: word }];

        contractions['they\'ll'] = [{ value: 'they', tag: word }, { value: '\'ll', tag: word }];
        contractions['THEY\'LL'] = [{ value: 'THEY', tag: word }, { value: '\'LL', tag: word }];
        contractions['They\'ll'] = [{ value: 'They', tag: word }, { value: '\'ll', tag: word }];

        contractions['they\'re'] = [{ value: 'they', tag: word }, { value: '\'re', tag: word }];
        contractions['THEY\'RE'] = [{ value: 'THEY', tag: word }, { value: '\'RE', tag: word }];
        contractions['They\'re'] = [{ value: 'They', tag: word }, { value: '\'re', tag: word }];

        contractions['we\'ve'] = [{ value: 'we', tag: word }, { value: '\'ve', tag: word }];
        contractions['WE\'VE'] = [{ value: 'WE', tag: word }, { value: '\'VE', tag: word }];
        contractions['We\'ve'] = [{ value: 'We', tag: word }, { value: '\'ve', tag: word }];

        contractions['we\'d'] = [{ value: 'we', tag: word }, { value: '\'d', tag: word }];
        contractions['WE\'D'] = [{ value: 'WE', tag: word }, { value: '\'D', tag: word }];
        contractions['We\'d'] = [{ value: 'We', tag: word }, { value: '\'d', tag: word }];

        contractions['we\'ll'] = [{ value: 'we', tag: word }, { value: '\'ll', tag: word }];
        contractions['WE\'LL'] = [{ value: 'WE', tag: word }, { value: '\'LL', tag: word }];
        contractions['We\'ll'] = [{ value: 'We', tag: word }, { value: '\'ll', tag: word }];

        contractions['we\'re'] = [{ value: 'we', tag: word }, { value: '\'re', tag: word }];
        contractions['WE\'RE'] = [{ value: 'WE', tag: word }, { value: '\'RE', tag: word }];
        contractions['We\'re'] = [{ value: 'We', tag: word }, { value: '\'re', tag: word }];

        contractions['she\'d'] = [{ value: 'she', tag: word }, { value: '\'d', tag: word }];
        contractions['SHE\'D'] = [{ value: 'SHE', tag: word }, { value: '\'D', tag: word }];
        contractions['She\'d'] = [{ value: 'She', tag: word }, { value: '\'d', tag: word }];

        contractions['she\'ll'] = [{ value: 'she', tag: word }, { value: '\'ll', tag: word }];
        contractions['SHE\'LL'] = [{ value: 'SHE', tag: word }, { value: '\'LL', tag: word }];
        contractions['She\'ll'] = [{ value: 'She', tag: word }, { value: '\'ll', tag: word }];

        contractions['she\'s'] = [{ value: 'she', tag: word }, { value: '\'s', tag: word }];
        contractions['SHE\'S'] = [{ value: 'SHE', tag: word }, { value: '\'S', tag: word }];
        contractions['She\'s'] = [{ value: 'She', tag: word }, { value: '\'s', tag: word }];

        contractions['he\'d'] = [{ value: 'he', tag: word }, { value: '\'d', tag: word }];
        contractions['HE\'D'] = [{ value: 'HE', tag: word }, { value: '\'D', tag: word }];
        contractions['He\'d'] = [{ value: 'He', tag: word }, { value: '\'d', tag: word }];

        contractions['he\'ll'] = [{ value: 'he', tag: word }, { value: '\'ll', tag: word }];
        contractions['HE\'LL'] = [{ value: 'HE', tag: word }, { value: '\'LL', tag: word }];
        contractions['He\'ll'] = [{ value: 'He', tag: word }, { value: '\'ll', tag: word }];

        contractions['he\'s'] = [{ value: 'he', tag: word }, { value: '\'s', tag: word }];
        contractions['HE\'S'] = [{ value: 'HE', tag: word }, { value: '\'S', tag: word }];
        contractions['He\'s'] = [{ value: 'He', tag: word }, { value: '\'s', tag: word }];

        contractions['it\'d'] = [{ value: 'it', tag: word }, { value: '\'d', tag: word }];
        contractions['IT\'D'] = [{ value: 'IT', tag: word }, { value: '\'D', tag: word }];
        contractions['It\'d'] = [{ value: 'It', tag: word }, { value: '\'d', tag: word }];

        contractions['it\'ll'] = [{ value: 'it', tag: word }, { value: '\'ll', tag: word }];
        contractions['IT\'LL'] = [{ value: 'IT', tag: word }, { value: '\'LL', tag: word }];
        contractions['It\'ll'] = [{ value: 'It', tag: word }, { value: '\'ll', tag: word }];

        contractions['it\'s'] = [{ value: 'it', tag: word }, { value: '\'s', tag: word }];
        contractions['IT\'S'] = [{ value: 'IT', tag: word }, { value: '\'S', tag: word }];
        contractions['It\'s'] = [{ value: 'It', tag: word }, { value: '\'s', tag: word }];

        // Wh Pronouns - what, who, when, where, why, how, there, that
        contractions['what\'ve'] = [{ value: 'what', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHAT\'VE'] = [{ value: 'WHAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['What\'ve'] = [{ value: 'What', tag: word }, { value: '\'ve', tag: word }];

        contractions['what\'d'] = [{ value: 'what', tag: word }, { value: '\'d', tag: word }];
        contractions['WHAT\'D'] = [{ value: 'WHAT', tag: word }, { value: '\'D', tag: word }];
        contractions['What\'d'] = [{ value: 'What', tag: word }, { value: '\'d', tag: word }];

        contractions['what\'ll'] = [{ value: 'what', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHAT\'LL'] = [{ value: 'WHAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['What\'ll'] = [{ value: 'What', tag: word }, { value: '\'ll', tag: word }];

        contractions['what\'re'] = [{ value: 'what', tag: word }, { value: '\'re', tag: word }];
        contractions['WHAT\'RE'] = [{ value: 'WHAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['What\'re'] = [{ value: 'What', tag: word }, { value: '\'re', tag: word }];

        contractions['who\'ve'] = [{ value: 'who', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHO\'VE'] = [{ value: 'WHO', tag: word }, { value: '\'VE', tag: word }];
        contractions['Who\'ve'] = [{ value: 'Who', tag: word }, { value: '\'ve', tag: word }];

        contractions['who\'d'] = [{ value: 'who', tag: word }, { value: '\'d', tag: word }];
        contractions['WHO\'D'] = [{ value: 'WHO', tag: word }, { value: '\'D', tag: word }];
        contractions['Who\'d'] = [{ value: 'Who', tag: word }, { value: '\'d', tag: word }];

        contractions['who\'ll'] = [{ value: 'who', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHO\'LL'] = [{ value: 'WHO', tag: word }, { value: '\'LL', tag: word }];
        contractions['Who\'ll'] = [{ value: 'Who', tag: word }, { value: '\'ll', tag: word }];

        contractions['who\'re'] = [{ value: 'who', tag: word }, { value: '\'re', tag: word }];
        contractions['WHO\'RE'] = [{ value: 'WHO', tag: word }, { value: '\'RE', tag: word }];
        contractions['Who\'re'] = [{ value: 'Who', tag: word }, { value: '\'re', tag: word }];

        contractions['when\'ve'] = [{ value: 'when', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHEN\'VE'] = [{ value: 'WHEN', tag: word }, { value: '\'VE', tag: word }];
        contractions['When\'ve'] = [{ value: 'When', tag: word }, { value: '\'ve', tag: word }];

        contractions['when\'d'] = [{ value: 'when', tag: word }, { value: '\'d', tag: word }];
        contractions['WHEN\'D'] = [{ value: 'WHEN', tag: word }, { value: '\'D', tag: word }];
        contractions['When\'d'] = [{ value: 'When', tag: word }, { value: '\'d', tag: word }];

        contractions['when\'ll'] = [{ value: 'when', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHEN\'LL'] = [{ value: 'WHEN', tag: word }, { value: '\'LL', tag: word }];
        contractions['When\'ll'] = [{ value: 'When', tag: word }, { value: '\'ll', tag: word }];

        contractions['when\'re'] = [{ value: 'when', tag: word }, { value: '\'re', tag: word }];
        contractions['WHEN\'RE'] = [{ value: 'WHEN', tag: word }, { value: '\'RE', tag: word }];
        contractions['When\'re'] = [{ value: 'When', tag: word }, { value: '\'re', tag: word }];

        contractions['where\'ve'] = [{ value: 'where', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHERE\'VE'] = [{ value: 'WHERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['Where\'ve'] = [{ value: 'Where', tag: word }, { value: '\'ve', tag: word }];

        contractions['where\'d'] = [{ value: 'where', tag: word }, { value: '\'d', tag: word }];
        contractions['WHERE\'D'] = [{ value: 'WHERE', tag: word }, { value: '\'D', tag: word }];
        contractions['Where\'d'] = [{ value: 'Where', tag: word }, { value: '\'d', tag: word }];

        contractions['where\'ll'] = [{ value: 'where', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHERE\'LL'] = [{ value: 'WHERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['Where\'ll'] = [{ value: 'Where', tag: word }, { value: '\'ll', tag: word }];

        contractions['where\'re'] = [{ value: 'where', tag: word }, { value: '\'re', tag: word }];
        contractions['WHERE\'RE'] = [{ value: 'WHERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['Where\'re'] = [{ value: 'Where', tag: word }, { value: '\'re', tag: word }];

        contractions['why\'ve'] = [{ value: 'why', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHY\'VE'] = [{ value: 'WHY', tag: word }, { value: '\'VE', tag: word }];
        contractions['Why\'ve'] = [{ value: 'Why', tag: word }, { value: '\'ve', tag: word }];

        contractions['why\'d'] = [{ value: 'why', tag: word }, { value: '\'d', tag: word }];
        contractions['WHY\'D'] = [{ value: 'WHY', tag: word }, { value: '\'D', tag: word }];
        contractions['Why\'d'] = [{ value: 'Why', tag: word }, { value: '\'d', tag: word }];

        contractions['why\'ll'] = [{ value: 'why', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHY\'LL'] = [{ value: 'WHY', tag: word }, { value: '\'LL', tag: word }];
        contractions['Why\'ll'] = [{ value: 'Why', tag: word }, { value: '\'ll', tag: word }];

        contractions['why\'re'] = [{ value: 'why', tag: word }, { value: '\'re', tag: word }];
        contractions['WHY\'RE'] = [{ value: 'WHY', tag: word }, { value: '\'RE', tag: word }];
        contractions['Why\'re'] = [{ value: 'Why', tag: word }, { value: '\'re', tag: word }];

        contractions['how\'ve'] = [{ value: 'how', tag: word }, { value: '\'ve', tag: word }];
        contractions['HOW\'VE'] = [{ value: 'HOW', tag: word }, { value: '\'VE', tag: word }];
        contractions['How\'ve'] = [{ value: 'How', tag: word }, { value: '\'ve', tag: word }];

        contractions['how\'d'] = [{ value: 'how', tag: word }, { value: '\'d', tag: word }];
        contractions['HOW\'D'] = [{ value: 'HOW', tag: word }, { value: '\'D', tag: word }];
        contractions['How\'d'] = [{ value: 'How', tag: word }, { value: '\'d', tag: word }];

        contractions['how\'ll'] = [{ value: 'how', tag: word }, { value: '\'ll', tag: word }];
        contractions['HOW\'LL'] = [{ value: 'HOW', tag: word }, { value: '\'LL', tag: word }];
        contractions['How\'ll'] = [{ value: 'How', tag: word }, { value: '\'ll', tag: word }];

        contractions['how\'re'] = [{ value: 'how', tag: word }, { value: '\'re', tag: word }];
        contractions['HOW\'RE'] = [{ value: 'HOW', tag: word }, { value: '\'RE', tag: word }];
        contractions['How\'re'] = [{ value: 'How', tag: word }, { value: '\'re', tag: word }];

        contractions['there\'ve'] = [{ value: 'there', tag: word }, { value: '\'ve', tag: word }];
        contractions['THERE\'VE'] = [{ value: 'THERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['There\'ve'] = [{ value: 'There', tag: word }, { value: '\'ve', tag: word }];

        contractions['there\'d'] = [{ value: 'there', tag: word }, { value: '\'d', tag: word }];
        contractions['THERE\'D'] = [{ value: 'THERE', tag: word }, { value: '\'D', tag: word }];
        contractions['There\'d'] = [{ value: 'There', tag: word }, { value: '\'d', tag: word }];

        contractions['there\'ll'] = [{ value: 'there', tag: word }, { value: '\'ll', tag: word }];
        contractions['THERE\'LL'] = [{ value: 'THERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['There\'ll'] = [{ value: 'There', tag: word }, { value: '\'ll', tag: word }];

        contractions['there\'re'] = [{ value: 'there', tag: word }, { value: '\'re', tag: word }];
        contractions['THERE\'RE'] = [{ value: 'THERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['There\'re'] = [{ value: 'There', tag: word }, { value: '\'re', tag: word }];

        contractions['that\'ve'] = [{ value: 'that', tag: word }, { value: '\'ve', tag: word }];
        contractions['THAT\'VE'] = [{ value: 'THAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['That\'ve'] = [{ value: 'That', tag: word }, { value: '\'ve', tag: word }];

        contractions['that\'d'] = [{ value: 'that', tag: word }, { value: '\'d', tag: word }];
        contractions['THAT\'D'] = [{ value: 'THAT', tag: word }, { value: '\'D', tag: word }];
        contractions['That\'d'] = [{ value: 'That', tag: word }, { value: '\'d', tag: word }];

        contractions['that\'ll'] = [{ value: 'that', tag: word }, { value: '\'ll', tag: word }];
        contractions['THAT\'LL'] = [{ value: 'THAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['That\'ll'] = [{ value: 'That', tag: word }, { value: '\'ll', tag: word }];

        contractions['that\'re'] = [{ value: 'that', tag: word }, { value: '\'re', tag: word }];
        contractions['THAT\'RE'] = [{ value: 'THAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['That\'re'] = [{ value: 'That', tag: word }, { value: '\'re', tag: word }];

        // Let us!
        contractions['let\'s'] = [{ value: 'let', tag: word }, { value: '\'s', tag: word }];
        contractions['LET\'S'] = [{ value: 'THAT', tag: word }, { value: '\'S', tag: word }];
        contractions['Let\'s'] = [{ value: 'Let', tag: word }, { value: '\'s', lemma: 'us' }];

        module.exports = contractions;
    }, {}], 19: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var contractions = require('./eng-contractions.js');
        var rgxSpaces = /\s+/g;
        // Ordinals only for Latin like 1st, 2nd or 12th or 33rd.
        var rgxOrdinalL1 = /1\dth|[04-9]th|1st|2nd|3rd|[02-9]1st|[02-9]2nd|[02-9]3rd|[02-9][04-9]th|\d+\d[04-9]th|\d+\d1st|\d+\d2nd|\d+\d3rd/g;
        // Apart from detecting pure integers or decimals, also detect numbers containing
        // `. - / ,` so that dates, ip address, fractions and things like codes or part
        // numbers are also detected as numbers only. These regex will therefore detected
        // 8.8.8.8 or 12-12-1924 or 1,1,1,1.00 or 1/4 or 1/4/66/777 as numbers.
        // Latin-1 Numbers.
        var rgxNumberL1 = /\d+\/\d+|\d(?:[\.\,\-\/]?\d)*(?:\.\d+)?/g;
        // Devanagari Numbers.
        var rgxNumberDV = /[\u0966-\u096F]+\/[\u0966-\u096F]+|[\u0966-\u096F](?:[\.\,\-\/]?[\u0966-\u096F])*(?:\.[\u0966-\u096F]+)?/g;
        var rgxMention = /\@\w+/g;
        // Latin-1 Hashtags.
        var rgxHashtagL1 = /\#[a-z][a-z0-9]*/gi;
        // Devanagari Hashtags; include Latin-1 as well.
        var rgxHashtagDV = /\#[\u0900-\u0963\u0970-\u097F][\u0900-\u0963\u0970-\u097F\u0966-\u096F0-9]*/gi;
        // EMail is EN character set.
        var rgxEmail = /[-!#$%&'*+\/=?^\w{|}~](?:\.?[-!#$%&'*+\/=?^\w`{|}~])*@[a-z0-9](?:-?\.?[a-z0-9])*(?:\.[a-z](?:-?[a-z0-9])*)+/gi;
        // Bitcoin, Ruble, Indian Rupee, Other Rupee, Dollar, Pound, Yen, Euro, Wong.
        var rgxCurrency = /[\₿\₽\₹\₨\$\£\¥\€\₩]/g;
        // These include both the punctuations: Latin-1 & Devanagari.
        var rgxPunctuation = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:\u0964\u0965]/g;
        var rgxQuotedPhrase = /\"[^\"]*\"/g;
        // NOTE: URL will support only EN character set for now.
        var rgxURL = /(?:https?:\/\/)(?:[\da-z\.-]+)\.(?:[a-z\.]{2,6})(?:[\/\w\.\-\?#=]*)*\/?/gi;
        var rgxEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/g;
        var rgxEmoticon = /:-?[dps\*\/\[\]\{\}\(\)]|;-?[/(/)d]|<3/gi;
        var rgxTime = /(?:\d|[01]\d|2[0-3]):?(?:[0-5][0-9])?\s?(?:[ap]\.?m\.?|hours|hrs)/gi;
        // Inlcude [Latin-1 Supplement Unicode Block](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block))
        var rgxWordL1 = /[a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF][a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\']*/gi;
        // Define [Devanagari Unicode Block](https://unicode.org/charts/PDF/U0900.pdf)
        var rgxWordDV = /[\u0900-\u094F\u0951-\u0963\u0970-\u097F]+/gi;
        // Symbols go here; including Om.
        var rgxSymbol = /[\u0950\~\@\#\%\^\+\=\*\|<>&]/g;
        // For detecting if the word is a potential contraction.
        var rgxContraction = /\'/;
        // Singular & Plural possessive
        var rgxPosSingular = /([a-z]+)(\'s)$/i;
        var rgxPosPlural = /([a-z]+s)(\')$/i;
        // Regexes and their categories; used for tokenizing via match/split. The
        // sequence is *critical* for correct tokenization.
        var rgxsMaster = [{ regex: rgxQuotedPhrase, category: 'quoted_phrase' }, { regex: rgxURL, category: 'url' }, { regex: rgxEmail, category: 'email' }, { regex: rgxMention, category: 'mention' }, { regex: rgxHashtagL1, category: 'hashtag' }, { regex: rgxHashtagDV, category: 'hashtag' }, { regex: rgxEmoji, category: 'emoji' }, { regex: rgxEmoticon, category: 'emoticon' }, { regex: rgxTime, category: 'time' }, { regex: rgxOrdinalL1, category: 'ordinal' }, { regex: rgxNumberL1, category: 'number' }, { regex: rgxNumberDV, category: 'number' }, { regex: rgxCurrency, category: 'currency' }, { regex: rgxWordL1, category: 'word' }, { regex: rgxWordDV, category: 'word' }, { regex: rgxPunctuation, category: 'punctuation' }, { regex: rgxSymbol, category: 'symbol' }];

        // Used to generate finger print from the tokens.
        // NOTE: this variable is being reset in `defineConfig()`.
        var fingerPrintCodes = {
            emoticon: 'c',
            email: 'e',
            emoji: 'j',
            hashtag: 'h',
            mention: 'm',
            number: 'n',
            ordinal: 'o',
            quoted_phrase: 'q', // eslint-disable-line camelcase
            currency: 'r',
            // symbol: 's',
            time: 't',
            url: 'u',
            word: 'w',
            alien: 'z'
        };

        // ### tokenizer
        /**
         *
         * Creates an instance of **`wink-tokenizer`**.
         *
         * @return {methods} object conatining set of API methods for tokenizing a sentence
         * and defining configuration, plugin etc.
         * @example
         * // Load wink tokenizer.
         * var tokenizer = require( 'wink-tokenizer' );
         * // Create your instance of wink tokenizer.
         * var myTokenizer = tokenizer();
        */
        var tokenizer = function () {
            // Default configuration: most comprehensive tokenization. Make deep copy!
            var rgxs = rgxsMaster.slice(0);
            // The result of last call to `tokenize()` is retained here.
            var finalTokens = [];
            // Returned!
            var methods = Object.create(null);

            // ### manageContraction
            /**
             *
             * Splits a contractions into words by first trying a lookup in strandard
             * `contractions`; if the lookup fails, it checks for possessive in `'s` or
             * `s'` forms and separates the possesive part from the word. Otherwise the
             * contraction is treated as a normal word and no splitting occurs.
             *
             * @param {string} word — that could be a potential conraction.
             * @param {object[]} tokens — where the outcome is pushed.
             * @return {object[]} updated tokens according to the `word.`
             * @private
            */
            var manageContraction = function (word, tokens) {
                var ct = contractions[word];
                var matches;
                if (ct === undefined) {
                    // Try possesive of sigular & plural forms
                    matches = word.match(rgxPosSingular);
                    if (matches) {
                        tokens.push({ value: matches[1], tag: 'word' });
                        tokens.push({ value: matches[2], tag: 'word' });
                    } else {
                        matches = word.match(rgxPosPlural);
                        if (matches) {
                            tokens.push({ value: matches[1], tag: 'word' });
                            tokens.push({ value: matches[2], tag: 'word' });
                        } else tokens.push({ value: word, tag: 'word' });
                    }
                } else {
                    // Manage via lookup; ensure cloning!
                    tokens.push(Object.assign({}, ct[0]));
                    tokens.push(Object.assign({}, ct[1]));
                }
                return tokens;
            }; // manageContraction()

            // ### tokenizeTextUnit
            /**
             *
             * Attempts to tokenize the input `text` using the `rgxSplit`. The tokenization
             * is carried out by combining the regex matches and splits in the right sequence.
             * The matches are the *real tokens*, whereas splits are text units that are
             * tokenized in later rounds! The real tokens (i.e. matches) are pushed as
             * `object` and splits as `string`.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} rgxSplit — object containing the regex and it's category.
             * @return {array} of tokens.
             * @private
            */
            var tokenizeTextUnit = function (text, rgxSplit) {
                // Regex matches go here; note each match is a token and has the same tag
                // as of regex's category.
                var matches = text.match(rgxSplit.regex);
                // Balance is "what needs to be tokenized".
                var balance = text.split(rgxSplit.regex);
                // The result, in form of combination of tokens & matches, is captured here.
                var tokens = [];
                // The tag;
                var tag = rgxSplit.category;
                // Helper variables.
                var aword,
                    i,
                    imax,
                    k = 0,
                    t;

                // Combine tokens & matches in the following pattern [ b0 m0 b1 m1 ... ]
                matches = matches ? matches : [];
                for (i = 0, imax = balance.length; i < imax; i += 1) {
                    t = balance[i];
                    t = t.trim();
                    if (t) tokens.push(t);
                    if (k < matches.length) {
                        if (tag === 'word') {
                            // Tag type `word` token may have a contraction.
                            aword = matches[k];
                            if (rgxContraction.test(aword)) {
                                tokens = manageContraction(aword, tokens);
                            } else {
                                // Means there is no contraction.
                                tokens.push({ value: aword, tag: tag });
                            }
                        } else tokens.push({ value: matches[k], tag: tag });
                    }
                    k += 1;
                }

                return tokens;
            }; // tokenizeTextUnit()

            // ### tokenizeTextRecursively
            /**
             *
             * Tokenizes the input text recursively using the array of `regexes` and then
             * the `tokenizeTextUnit()` function. If (or whenever) the `regexes` becomes
             * empty, it simply splits the text on non-word characters instead of using
             * the `tokenizeTextUnit()` function.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} regexes — object containing the regex and it's category.
             * @return {undefined} nothing!
             * @private
            */
            var tokenizeTextRecursively = function (text, regexes) {
                var sentence = text.trim();
                var tokens = [];
                var i, imax;

                if (!regexes.length) {
                    // No regex left, split on `spaces` and tag every token as **alien**.
                    text.split(rgxSpaces).forEach(function (tkn) {
                        finalTokens.push({ value: tkn.trim(), tag: 'alien' });
                    });
                    return;
                }

                var rgx = regexes[0];
                tokens = tokenizeTextUnit(sentence, rgx);

                for (i = 0, imax = tokens.length; i < imax; i += 1) {
                    if (typeof tokens[i] === 'string') {
                        // Strings become candidates for further tokenization.
                        tokenizeTextRecursively(tokens[i], regexes.slice(1));
                    } else {
                        finalTokens.push(tokens[i]);
                    }
                }
            }; // tokenizeTextRecursively()

            // ### defineConfig
            /**
             *
             * Defines the configuration in terms of the types of token that will be
             * extracted by [`tokenize()`](#tokenize) method. Note by default, all types
             * of tokens will be detected and tagged automatically.
             *
             * @param {object} config — It defines 0 or more properties from the list of
             * **14** properties. A true value for a property ensures tokenization
             * for that type of text; whereas false value will mean that the tokenization of that
             * type of text will not be attempted. It also **resets** the effect of any previous
             * call(s) to the [`addRegex()`](#addregex) API.
             *
             * *An empty config object is equivalent to splitting on spaces. Whatever tokens
             * are created like this are tagged as **alien** and **`z`** is the
             * [finger print](#gettokensfp) code of this token type.*
             *
             * The table below gives the name of each property and it's description including
             * examples. The character with in paranthesis is the [finger print](#gettokensfp) code for the
             * token of that type.
             * @param {boolean} [config.currency=true] such as **$** or **£** symbols (**`r`**)
             * @param {boolean} [config.email=true] for example **john@acme.com** or **superman1@gmail.com** (**`e`**)
             * @param {boolean} [config.emoji=true] any standard unicode emojis e.g. 😊 or 😂 or 🎉 (**`j`**)
             * @param {boolean} [config.emoticon=true] common emoticons such as **`:-)`** or **`:D`** (**`c`**)
             * @param {boolean} [config.hashtag=true] hash tags such as **`#happy`** or **`#followme`** (**`h`**)
             * @param {boolean} [config.number=true] any integer, decimal number, fractions such as **19**, **2.718**
             * or **1/4** and numerals containing "**`, - / .`**", for example 12-12-1924 (**`n`**)
             * @param {boolean} [config.ordinal=true] ordinals like **1st**, **2nd**, **3rd**, **4th** or **12th** or **91st** (**`o`**)
             * @param {boolean} [config.punctuation=true] common punctuation such as **`?`** or **`,`**
             * ( token becomes fingerprint )
             * @param {boolean} [config.quoted_phrase=true] any **"quoted text"** in the sentence. (**`q`**)
             * @param {boolean} [config.symbol=true] for example **`~`** or **`+`** or **`&`** or **`%`** ( token becomes fingerprint )
             * @param {boolean} [config.time=true] common representation of time such as **4pm** or **16:00 hours** (**`t`**)
             * @param {boolean} [config.mention=true] **@mention**  as in github or twitter (**`m`**)
             * @param {boolean} [config.url=true] URL such as **https://github.com** (**`u`**)
             * @param {boolean} [config.word=true] word such as **faster** or **résumé** or **prévenir** (**`w`**)
             * @return {number} number of properties set to true from the list of above 13.
             * @example
             * // Do not tokenize & tag @mentions.
             * var myTokenizer.defineConfig( { mention: false } );
             * // -> 13
             * // Only tokenize words as defined above.
             * var myTokenizer.defineConfig( {} );
             * // -> 0
            */
            var defineConfig = function (config) {
                if (typeof config === 'object' && Object.keys(config).length) {
                    rgxs = rgxsMaster.filter(function (rgx) {
                        // Config for the Category of `rgx`.
                        var cc = config[rgx.category];
                        // Means `undefined` & `null` values are taken as true; otherwise
                        // standard **truthy** and **falsy** interpretation applies!!
                        return cc === undefined || cc === null || !!cc;
                    });
                } else rgxs = [];
                // Count normalized length i.e. ignore multi-script entries.
                const uniqueCats = Object.create(null);
                rgxs.forEach(function (rgx) {
                    uniqueCats[rgx.category] = true;
                });
                // Reset the `fingerPrintCodes` variable.
                fingerPrintCodes = {
                    emoticon: 'c',
                    email: 'e',
                    emoji: 'j',
                    hashtag: 'h',
                    mention: 'm',
                    number: 'n',
                    ordinal: 'o',
                    quoted_phrase: 'q', // eslint-disable-line camelcase
                    currency: 'r',
                    // symbol: 's',
                    time: 't',
                    url: 'u',
                    word: 'w',
                    alien: 'z'
                };
                return Object.keys(uniqueCats).length;
            }; // defineConfig()

            // ### tokenize
            /**
             *
             * Tokenizes the input `sentence` using the configuration specified via
             * [`defineConfig()`](#defineconfig).
             * Common contractions and possessive nouns are split into 2 separate tokens;
             * for example **I'll** splits as `'I'` and `'\'ll'` or **won't** splits as
             * `'wo'` and `'n\'t'`.
             *
             * @param {string} sentence — the input sentence.
             * @return {object[]} of tokens; each one of them is an object with 2-keys viz.
             * `value` and its `tag` identifying the type of the token.
             * @example
             * var s = 'For detailed API docs, check out http://winkjs.org/wink-regression-tree/ URL!';
             * myTokenizer.tokenize( s );
             * // -> [ { value: 'For', tag: 'word' },
             * //      { value: 'detailed', tag: 'word' },
             * //      { value: 'API', tag: 'word' },
             * //      { value: 'docs', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'check', tag: 'word' },
             * //      { value: 'out', tag: 'word' },
             * //      { value: 'http://winkjs.org/wink-regression-tree/', tag: 'url' },
             * //      { value: 'URL', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
            */
            var tokenize = function (sentence) {
                finalTokens = [];
                tokenizeTextRecursively(sentence, rgxs);
                return finalTokens;
            }; // tokenize()

            // ### getTokensFP
            /**
             *
             * Returns the finger print of the tokens generated by the last call to
             * [`tokenize()`](#tokenize). A finger print is a string created by sequentially
             * joining the unique code of each token's type. Refer to table given under
             * [`defineConfig()`](#defineconfig) for values of these codes.
             *
             * A finger print is extremely useful in spotting patterns present in the sentence
             * using `regexes`, which is otherwise a complex and time consuming task.
             *
             * @return {string} finger print of tokens generated by the last call to `tokenize()`.
             * @example
             * // Generate finger print of sentence given in the previous example
             * // under tokenize().
             * myTokenizer.getTokensFP();
             * // -> 'wwww,wwuw!'
            */
            var getTokensFP = function () {
                var fp = [];
                finalTokens.forEach(function (t) {
                    fp.push(fingerPrintCodes[t.tag] ? fingerPrintCodes[t.tag] : t.value);
                });
                return fp.join('');
            }; // getFingerprint()

            // ### addTag
            var addTag = function (name, fingerprintCode) {
                if (fingerPrintCodes[name]) {
                    throw new Error('Tag ' + name + ' already exists');
                }

                fingerPrintCodes[name] = fingerprintCode;
            }; // addTag()

            // ### addRegex
            /**
             * Adds a regex for parsing a new type of token. This regex can either be mapped
             * to an existing tag or it allows creation of a new tag along with its finger print.
             * The uniqueness of the [finger prints](#defineconfig) have to ensured by the user.
             *
             * *The added regex(s) will supersede the internal parsing.*
             *
             * @param {RegExp} regex — the new regular expression.
             * @param {string} tag — tokens matching the `regex` will be assigned this tag.
             * @param {string} [fingerprintCode=undefined] — required if adding a new
             * tag; ignored if using an existing tag.
             * @return {void} nothing!
             * @example
             * // Adding a regex for an existing tag
             * myTokenizer.addRegex( /\(oo\)/gi, 'emoticon' );
             * myTokenizer.tokenize( '(oo) Hi!' )
             * // -> [ { value: '(oo)', tag: 'emoticon' },
             * //      { value: 'Hi', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
             *
             * // Adding a regex to parse a new token type
             * myTokenizer.addRegex( /hello/gi, 'greeting', 'g' );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'greeting' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
             * // Notice how "hello" is now tagged as "greeting" and not as "word".
             *
             * // Using definConfig will reset the above!
             * myTokenizer.defineConfig( { word: true } );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
            */

            var addRegex = function (regex, tag, fingerprintCode) {
                if (!fingerPrintCodes[tag] && !fingerprintCode) {
                    throw new Error('Tag ' + tag + ' doesn\'t exist; Provide a \'fingerprintCode\' to add it as a tag.');
                } else if (!fingerPrintCodes[tag]) {
                    addTag(tag, fingerprintCode);
                }

                rgxs.unshift({ regex: regex, category: tag });
            }; // addRegex()

            methods.defineConfig = defineConfig;
            methods.tokenize = tokenize;
            methods.getTokensFP = getTokensFP;
            methods.addTag = addTag;
            methods.addRegex = addRegex;
            return methods;
        };

        module.exports = tokenizer;
    }, { "./eng-contractions.js": 18 }], 20: [function (require, module, exports) {
        module.exports = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "would", "should", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very"];
    }, {}], 21: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnIndexer

        /**
         *
         * Returns an Indexer object that contains two functions. The first function `build()`
         * incrementally builds an index for each `element` using `itsIndex` — both passed as
         * parameters to it. The second function — `result()` allows accessing the index anytime.
         *
         * It is typically used with [string.soc](#stringsoc), [string.bong](#stringbong),
         * [string.song](#stringsong), and [tokens.sow](#tokenssow).
         *
         * @name helper.returnIndexer
         * @return {indexer} used to build and access the index.
         * @example
         * var indexer = returnIndexer();
         * // -> { build: [function], result: [function] }
         */
        var returnIndexer = function () {
            var theIndex = Object.create(null);
            var methods = Object.create(null);

            // Builds index by adding the `element` and `itsIndex`. The `itsIndex` should
            // be a valid JS array index; no validation checks are performed while building
            // index.
            var build = function (element, itsIndex) {
                theIndex[element] = theIndex[element] || [];
                theIndex[element].push(itsIndex);
                return true;
            }; // build()

            // Returns the index built so far.
            var result = function () {
                return theIndex;
            }; // result()

            methods.build = build;
            methods.result = result;

            return methods;
        }; // index()

        module.exports = returnIndexer;
    }, {}], 22: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnQuotedTextExtractor

        /**
         *
         * Returns a function that extracts all occurrences of every quoted text
         * between the `lq` and the `rq` characters from its argument. This argument
         * must be of type string.
         *
         * @name helper.returnQuotedTextExtractor
         * @param {string} [lq='"'] — the left quote character.
         * @param {string} [rq='"'] — the right quote character.
         * @return {function} that will accept an input string argument and return an
         * array of all substrings that are quoted between `lq` and `rq`.
         * @example
         * var extractQuotedText = returnQuotedTextExtractor();
         * extractQuotedText( 'Raise 2 issues - "fix a bug" & "run tests"' );
         * // -> [ 'fix a bug', 'run tests' ]
         */
        var returnQuotedTextExtractor = function (lq, rq) {
            var // Index variable for *for-loop*
                i,

                // Set defaults for left quote, if required.
                lq1 = lq && typeof lq === 'string' ? lq : '"',

                // Extracts its length
                lqLen = lq1.length,

                // The regular expression is created here.
                regex = null,

                // The string containing the regular expression builds here.
                rgxStr = '',

                // Set defaults for right quote, if required.
                rq1 = rq && typeof rq === 'string' ? rq : lq1,

                // Extract its length.
                rqLen = rq1.length;

            // Build `rgxStr`
            for (i = 0; i < lqLen; i += 1) rgxStr += '\\' + lq1.charAt(i);
            rgxStr += '.*?';
            for (i = 0; i < rqLen; i += 1) rgxStr += '\\' + rq1.charAt(i);
            // Create regular expression.
            regex = new RegExp(rgxStr, 'g');
            // Return the extractor function.
            return function (s) {
                if (!s || typeof s !== 'string') return null;
                var // Extracted elements are captured here.
                    elements = [],

                    // Extract matches with quotes
                    matches = s.match(regex);
                if (!matches || matches.length === 0) return null;
                // Collect elements after removing the quotes.
                for (var k = 0, kmax = matches.length; k < kmax; k += 1) {
                    elements.push(matches[k].substr(lqLen, matches[k].length - (rqLen + lqLen)));
                }
                return elements;
            };
        }; // returnQuotedTextExtractor()

        module.exports = returnQuotedTextExtractor;
    }, {}], 23: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnWordsFilter

        /**
         *
         * Returns an object containing the following functions: (a) `set()`, which returns
         * a set of mapped words given in the input array `words`. (b) `exclude()` that
         * is suitable for array filtering operations.
         *
         * If the second argument `mappers` is provided as an array of maping functions
         * then these are applied on the input array before converting into a set. A
         * mapper function must accept a string as argument and return a string as the result.
         * Examples of mapper functions are typically **string** functionss of **`wink-nlp-utils`**
         * such as `string.lowerCase()`, `string.stem()` and
         * `string.soundex()`.
         *
         * @name helper.returnWordsFilter
         * @param {string[]} words — that can be filtered using the returned wordsFilter.
         * @param {function[]} [mappers=undefined] — optionally used to map each word before creating
         * the wordsFilter.
         * @return {wordsFilter} object containg `set()` and `exclude()` functions for `words`.
         * @example
         * var stopWords = [ 'This', 'That', 'Are', 'Is', 'Was', 'Will', 'a' ];
         * var myFilter = returnWordsFilter( stopWords, [ string.lowerCase ] );
         * [ 'this', 'is', 'a', 'cat' ].filter( myFilter.exclude );
         * // -> [ 'cat' ]
         */
        var returnWordsFilter = function (words, mappers) {
            var mappedWords = words;
            var givenMappers = mappers || [];
            givenMappers.forEach(function (m) {
                mappedWords = mappedWords.map(m);
            });

            mappedWords = new Set(mappedWords);

            var exclude = function (t) {
                return !mappedWords.has(t);
            }; // exclude()

            var set = function () {
                return mappedWords;
            }; // set()

            return {
                set: set,
                exclude: exclude
            };
        }; // returnWordsFilter()

        module.exports = returnWordsFilter;
    }, {}], 24: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var degrees = [/\bm\.?\s*a\b/i, /\bb\.?\s*a\b/i, /\bb\.?\s*tech\b/i, /\bm\.?\s*tech\b/i, /\bb\.?\s*des\b/i, /\bm\.?\s*des\b/i, /\bm\.?\s*b\.?\s*a\b/i, /\bm\.?\s*c\.?\s*a\b/i, /\bb\.?\s*c\.?\s*a\b/i, /\bl\.?\s*l\.?\s*b\b/i, /\bl\.?\s*l\.?\s*m\b/i, /\bm\.?\s*b\.?\s*b\.?\s*s\b/i, /\bm\.?\s*d\b/i, /\bd\.?\s*m\b/i, /\bm\.?\s*s\b/i, /\bd\.?\s*n\.?\s*b\b/i, /\bd\.?\s*g\.?\s*o\b/i, /\bd\.?\s*l\.?\s*o\b/i, /\bb\.?\s*d\.?\s*s\b/i, /\bb\.?\s*h\.?\s*m\.?\s*s\b/i, /\bb\.?\s*a\.?\s*m\.?\s*s\b/i, /\bf\.?\s*i\.?\s*c\.?\s*s\b/i, /\bm\.?\s*n\.?\s*a\.?\s*m\.?\s*s\b/i, /\bb\.?\s*e\.?\s*m\.?\s*s\b/i, /\bd\.?\s*c\.?\s*h\b/i, /\bm\.?\s*c\.?\s*h\b/i, /\bf\.?\s*r\.?\s*c\.?\s*s\b/i, /\bm\.?\s*r\.?\s*c\.?\s*p\b/i, /\bf\.?\s*i\.?\s*a\.?\s*c\.?\s*m\b/i, /\bf\.?\s*i\.?\s*m\.?\s*s\.?\s*a\b/i, /\bp\.?\s*h\.?\s*d\b/i];

        var titleNames = ['mr', 'mrs', 'miss', 'ms', 'master', 'er', 'dr', 'shri', 'shrimati', 'sir'];

        var titles = new RegExp('^(?:' + titleNames.join('|') + ')$', 'i');

        module.exports = {
            degrees: degrees,
            titles: titles
        };
    }, {}], 25: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        /* eslint no-underscore-dangle: "off" */
        var rgx = Object.create(null);
        // Remove repeating characters.
        rgx.repeatingChars = /([^c])\1/g;
        // Drop first character from character pairs, if found in the beginning.
        rgx.kngnPairs = /^(kn|gn|pn|ae|wr)/;
        // Drop vowels that are not found in the beginning.
        rgx.__vowels = /(?!^)[aeiou]/g;
        // Replaces `ough` in the end by 'f'
        rgx.ough = /ough$/;
        // Replace following 3 instances of `dg` by `j`.
        rgx.dge = /dge/g;
        rgx.dgi = /dgi/g;
        rgx.dgy = /dgy/g;
        // Replace `sch` by `sk`.
        rgx.sch = /sch/g;
        // Drop `c` in `sci, sce, scy`.
        rgx.sci = /sci/g;
        rgx.sce = /sce/g;
        rgx.scy = /scy/g;
        // Make 'sh' out of `tio & tia`.
        rgx.tio = /tio/g;
        rgx.tia = /tia/g;
        // `t` is silent in `tch`.
        rgx.tch = /tch/g;
        // Drop `b` in the end if preceeded by `m`.
        rgx.mb_ = /mb$/;
        // These are pronounced as `k`.
        rgx.cq = /cq/g;
        rgx.ck = /ck/g;
        // Here `c` sounds like `s`
        rgx.ce = /ce/g;
        rgx.ci = /ci/g;
        rgx.cy = /cy/g;
        // And this `f`.
        rgx.ph = /ph/g;
        // The `sh` finally replaced by `x`.
        rgx.sh = /sh|sio|sia/g;
        // This is open rgx - TODO: need to finalize.
        rgx.vrnotvy = /([aeiou])(r)([^aeiouy])/g;
        // `th` sounds like theta - make it 0.
        rgx.th = /th/g;
        // `c` sounds like `k` except when it is followed by `h`.
        rgx.cnoth = /(c)([^h])/g;
        // Even `q` sounds like `k`.
        rgx.q = /q/g;
        // The first `x` sounds like `s`.
        rgx._x = /^x/;
        // Otherwise `x` is more like `ks`.
        rgx.x = /x/g;
        // Drop `y` if not followed by a vowel or appears in the end.
        rgx.ynotv = /(y)([^aeiou])/g;
        rgx.y_ = /y$/;
        // `z` is `s`.
        rgx.z = /z/g;

        // Export rgx.
        module.exports = rgx;
    }, {}], 26: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### amplifyNotElision
        /**
         *
         * Amplifies the not elision by converting it into not; for example `isn't`
         * becomes `is not`.
         *
         * @name string.amplifyNotElision
         * @param {string} str — the input string.
         * @return {string} input string after not elision amplification.
         * @example
         * amplifyNotElision( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is not it?"
         */
        var amplifyNotElision = function (str) {
            return str.replace(rgx.notElision, '$1 not');
        }; // amplifyNotElision()

        module.exports = amplifyNotElision;
    }, { "./util_regexes.js": 60 }], 27: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bong
        /**
         *
         * Generates the bag of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate bag of bigrams by default. It
         * also has an alias **`bong()`**.
         *
         * @name string.bagOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of ngrams of `size` from `str`.
         * @example
         * bagOfNGrams( 'mama' );
         * // -> { ma: 2, am: 1 }
         * bong( 'mamma' );
         * // -> { ma: 2, am: 1, mm: 1 }
         */
        var bong = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngBOW = Object.create(null),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    // Call `ifn` iff its defined and `tg` is appearing for the first time;
                    // this avoids multiple calls to `ifn`. Strategy applies to `song()`,
                    // and `bow()`.
                    if (typeof ifn === 'function' && !ngBOW[tg]) {
                        ifn(tg, idx);
                    }
                    // Now define, if required and then update counts.
                    ngBOW[tg] = 1 + (ngBOW[tg] || 0);
                }
            }
            return ngBOW;
        }; // bong()

        module.exports = bong;
    }, {}], 28: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');
        var returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');
        var extractQuotedText = returnQuotedTextExtractor('[', ']');
        // ## string

        // ### composeCorpus
        /**
         *
         * Generates all possible sentences from the input argument string.
         * The string s must follow a special syntax as illustrated in the
         * example below:<br/>
         * `'[I] [am having|have] [a] [problem|question]'`<br/>
         *
         * Each phrase must be quoted between `[ ]` and each possible option of phrases
         * (if any) must be separated by a `|` character. The corpus is composed by
         * computing the cartesian product of all the phrases.
         *
         * @name string.composeCorpus
         * @param {string} str — the input string.
         * @return {string[]} of all possible sentences.
         * @example
         * composeCorpus( '[I] [am having|have] [a] [problem|question]' );
         * // -> [ 'I am having a problem',
         * //      'I am having a question',
         * //      'I have a problem',
         * //      'I have a question' ]
         */
        var composeCorpus = function (str) {
            if (!str || typeof str !== 'string') return [];

            var quotedTextElems = extractQuotedText(str);
            var corpus = [];
            var finalCorpus = [];

            if (!quotedTextElems) return [];
            quotedTextElems.forEach(function (e) {
                corpus.push(e.split('|'));
            });

            helpers.array.product(corpus).forEach(function (e) {
                finalCorpus.push(e.join(' '));
            });
            return finalCorpus;
        }; // composeCorpus()

        module.exports = composeCorpus;
    }, { "./helper-return-quoted-text-extractor.js": 22, "wink-helpers": 17 }], 29: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### edgeNGrams
        /**
         *
         * Generates the edge ngrams from the input string.
         *
         * @name string.edgeNGrams
         * @param {string} str — the input string.
         * @param {number} [min=2] — size of ngram generated.
         * @param {number} [max=8] — size of ngram is generated.
         * @param {number} [delta=2] — edge ngrams are generated in increments of this value.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every edge ngram of `str`; and it receives the edge ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string[]} of edge ngrams.
         * @example
         * edgeNGrams( 'decisively' );
         * // -> [ 'de', 'deci', 'decisi', 'decisive' ]
         * edgeNGrams( 'decisively', 8, 10, 1 );
         * // -> [ 'decisive', 'decisivel', 'decisively' ]
         */
        var edgeNGrams = function (str, min, max, delta, ifn, idx) {
            var dlta = delta || 2,
                eg,
                egs = [],
                imax = Math.min(max || 8, str.length) + 1,
                start = min || 2;

            // Generate edge ngrams
            for (var i = start; i < imax; i += dlta) {
                eg = str.slice(0, i);
                egs.push(eg);
                if (typeof ifn === 'function') {
                    ifn(eg, idx);
                }
            }
            return egs;
        }; // edgeNGrams()

        module.exports = edgeNGrams;
    }, {}], 30: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var ncrgx = require('./name_cleaner_regexes.js');

        // ## string

        // ### extractPersonsName
        /**
         *
         * Attempts to extract person's name from input string.
         * It assmues the following name format:<br/>
         * `[<salutations>] <name part as FN [MN] [LN]> [<degrees>]`<br/>
         * Entities in square brackets are optional.
         *
         * @name string.extractPersonsName
         * @param {string} str — the input string.
         * @return {string} extracted name.
         * @example
         * extractPersonsName( 'Dr. Sarah Connor M. Tech., PhD. - AI' );
         * // -> 'Sarah Connor'
         */
        var extractPersonsName = function (str) {
            // Remove Degrees by making the list of indexes of each degree and subsequently
            // finding the minimum and slicing from there!
            var indexes = ncrgx.degrees.map(function (r) {
                var m = r.exec(str);
                return m ? m.index : 999999;
            });
            var sp = Math.min.apply(null, indexes);

            // Generate an Array of Every Elelemnt of Name (e.g. title, first name,
            // sir name, honours, etc)
            var aeen = str.slice(0, sp).replace(rgx.notAlpha, ' ').replace(rgx.spaces, ' ').trim().split(' ');
            // Remove titles from the beginning.
            while (aeen.length && ncrgx.titles.test(aeen[0])) aeen.shift();
            return aeen.join(' ');
        }; // extractPersonsName()

        module.exports = extractPersonsName;
    }, { "./name_cleaner_regexes.js": 24, "./util_regexes.js": 60 }], 31: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var trim = require('./string-trim.js');
        // ## string

        // ### extractRunOfCapitalWords
        /**
         *
         * Extracts the array of text appearing as Title Case or in ALL CAPS from the
         * input string.
         *
         * @name string.extractRunOfCapitalWords
         * @param {string} str — the input string.
         * @return {string[]} of text appearing in Title Case or in ALL CAPS; if no such
         * text is found then `null` is returned.
         * @example
         * extractRunOfCapitalWords( 'In The Terminator, Sarah Connor is in Los Angeles' );
         * // -> [ 'In The Terminator', 'Sarah Connor', 'Los Angeles' ]
         */
        var extractRunOfCapitalWords = function (str) {
            var m = str.match(rgx.rocWords);
            return m ? m.map(trim) : m;
        }; // extractRunOfCapitalWords()

        module.exports = extractRunOfCapitalWords;
    }, { "./string-trim.js": 49, "./util_regexes.js": 60 }], 32: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### lowerCase
        /**
         *
         * Converts the input string to lower case.
         *
         * @name string.lowerCase
         * @param {string} str — the input string.
         * @return {string} input string in lower case.
         * @example
         * lowerCase( 'Lower Case' );
         * // -> 'lower case'
         */
        var lowerCase = function (str) {
            return str.toLowerCase();
        }; // lowerCase()

        module.exports = lowerCase;
    }, {}], 33: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### marker
        /**
         *
         * Generates `marker` of the input string; it is defined as 1-gram, sorted
         * and joined back as a string again. Marker is a quick and aggressive way
         * to detect similarity between short strings. Its aggression may lead to more
         * false positives such as `Meter` and `Metre` or `no melon` and `no lemon`.
         *
         * @name string.marker
         * @param {string} str — the input string.
         * @return {string} the marker.
         * @example
         * marker( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var marker = function (str) {
            var uniqChars = Object.create(null);
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                uniqChars[str[i]] = true;
            }
            return Object.keys(uniqChars).sort().join('');
        }; // marker()

        module.exports = marker;
    }, {}], 34: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### ngram
        /**
         *
         * Generates an array of ngrams of a specified size from the input string. The
         * default size is 2, which means it will generate bigrams by default.
         *
         * @name string.ngram
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram's size.
         * @return {string[]} ngrams of `size` from `str`.
         * @example
         * ngram( 'FRANCE' );
         * // -> [ 'FR', 'RA', 'AN', 'NC', 'CE' ]
         * ngram( 'FRENCH' );
         * // -> [ 'FR', 'RE', 'EN', 'NC', 'CH' ]
         * ngram( 'FRANCE', 3 );
         * // -> [ 'FRA', 'RAN', 'ANC', 'NCE' ]
         */
        var ngram = function (str, size) {
            var ng = size || 2,
                ngramz = [],
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) ngramz.push(tg);
            }
            return ngramz;
        }; // ngram()

        module.exports = ngram;
    }, {}], 35: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var phnrgx = require('./phonetize_regexes.js');
        /* eslint no-underscore-dangle: "off" */

        // ## string

        // ### phonetize
        /**
         *
         * Phonetizes the input string using an algorithmic adaptation of Metaphone; It
         * is not an exact implementation of Metaphone.
         *
         * @name string.phonetize
         * @param {string} word — the input word.
         * @return {string} phonetic code of `word`.
         * @example
         * phonetize( 'perspective' );
         * // -> 'prspktv'
         * phonetize( 'phenomenon' );
         * // -> 'fnmnn'
         */
        var phonetize = function (word) {
            var p = word.toLowerCase();
            // Remove repeating letters.
            p = p.replace(phnrgx.repeatingChars, '$1');
            // Drop first character of `kgknPairs`.
            if (phnrgx.kngnPairs.test(p)) {
                p = p.substr(1, p.length - 1);
            }
            // Run Regex Express now!
            p = p
                // Change `ough` in the end as `f`,
                .replace(phnrgx.ough, 'f')
                // Change `dg` to `j`, in `dge, dgi, dgy`.
                .replace(phnrgx.dge, 'je').replace(phnrgx.dgi, 'ji').replace(phnrgx.dgy, 'jy')
                // Change `c` to `k` in `sch`
                .replace(phnrgx.sch, 'sk')
                // Drop `c` in `sci, sce, scy`.
                .replace(phnrgx.sci, 'si').replace(phnrgx.sce, 'se').replace(phnrgx.scy, 'sy')
                // Drop `t` if it appears as `tch`.
                .replace(phnrgx.tch, 'ch')
                // Replace `tio & tia` by `sh`.
                .replace(phnrgx.tio, 'sh').replace(phnrgx.tia, 'sh')
                // Drop `b` if it appears as `mb` in the end.
                .replace(phnrgx.mb_, 'm')
                // Drop `r` if it preceeds a vowel and not followed by a vowel or `y`
                // .replace( rgx.vrnotvy, '$1$3' )
                // Replace `c` by `s` in `ce, ci, cy`.
                .replace(phnrgx.ce, 'se').replace(phnrgx.ci, 'si').replace(phnrgx.cy, 'sy')
                // Replace `cq` by `q`.
                .replace(phnrgx.cq, 'q')
                // Replace `ck` by `k`.
                .replace(phnrgx.ck, 'k')
                // Replace `ph` by `f`.
                .replace(phnrgx.ph, 'f')
                // Replace `th` by `0` (theta look alike!).
                .replace(phnrgx.th, '0')
                // Replace `c` by `k` if it is not followed by `h`.
                .replace(phnrgx.cnoth, 'k$2')
                // Replace `q` by `k`.
                .replace(phnrgx.q, 'k')
                // Replace `x` by `s` if it appears in the beginning.
                .replace(phnrgx._x, 's')
                // Other wise replace `x` by `ks`.
                .replace(phnrgx.x, 'ks')
                // Replace `sh, sia, sio` by `x`. Needs to be done post `x` processing!
                .replace(phnrgx.sh, 'x')
                // Drop `y` if it is now followed by a **vowel**.
                .replace(phnrgx.ynotv, '$2').replace(phnrgx.y_, '')
                // Replace `z` by `s`.
                .replace(phnrgx.z, 's')
                // Drop all **vowels** excluding the first one.
                .replace(phnrgx.__vowels, '');

            return p;
        }; // phonetize()

        module.exports = phonetize;
    }, { "./phonetize_regexes.js": 25 }], 36: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeElisions
        /**
         *
         * Removes basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it retains
         * apostrophe used to indicate possession.
         *
         * @name string.removeElisions
         * @param {string} str — the input string.
         * @return {string} input string after removal of elisions.
         * @example
         * removeElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is it?"
         */
        var removeElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2').replace(rgx.elisions1, '$1').replace(rgx.elisions2, '$1');
        }; // removeElisions()

        module.exports = removeElisions;
    }, { "./util_regexes.js": 60 }], 37: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeExtraSpaces
        /**
         *
         * Removes leading, trailing and any extra in-between whitespaces from the input
         * string.
         *
         * @name string.removeExtraSpaces
         * @param {string} str — the input string.
         * @return {string} input string after removal of leading, trailing and extra
         * whitespaces.
         * @example
         * removeExtraSpaces( '   Padded   Text    ' );
         * // -> 'Padded Text'
         */
        var removeExtraSpaces = function (str) {
            return str.trim().replace(rgx.spaces, ' ');
        }; // removeExtraSpaces()

        module.exports = removeExtraSpaces;
    }, { "./util_regexes.js": 60 }], 38: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeHTMLTags
        /**
         *
         * Removes each HTML tag by replacing it with a whitespace.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeHTMLTags
         * @param {string} str — the input string.
         * @return {string} input string after removal of HTML tags.
         * @example
         * removeHTMLTags( '<p>Vive la France&nbsp;&#160;!</p>' );
         * // -> ' Vive la France  ! '
         */
        var removeHTMLTags = function (str) {
            return str.replace(rgx.htmlTags, ' ').replace(rgx.htmlEscSeq1, ' ').replace(rgx.htmlEscSeq2, ' ');
        }; // removeHTMLTags()

        module.exports = removeHTMLTags;
    }, { "./util_regexes.js": 60 }], 39: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removePunctuations
        /**
         *
         * Removes each punctuation mark by replacing it with a whitespace. It looks for
         * the following punctuations — `.,;!?:"!'... - () [] {}`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removePunctuations
         * @param {string} str — the input string.
         * @return {string} input string after removal of punctuations.
         * @example
         * removePunctuations( 'Punctuations like "\'\',;!?:"!... are removed' );
         * // -> 'Punctuations like               are removed'
         */
        var removePunctuations = function (str) {
            return str.replace(rgx.punctuations, ' ');
        }; // removePunctuations()

        module.exports = removePunctuations;
    }, { "./util_regexes.js": 60 }], 40: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeSplChars
        /**
         *
         * Removes each special character by replacing it with a whitespace. It looks for
         * the following special characters — `~@#%^*+=`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeSplChars
         * @param {string} str — the input string.
         * @return {string} input string after removal of special characters.
         * @example
         * removeSplChars( '4 + 4*2 = 12' );
         * // -> '4   4 2   12'
         */
        var removeSplChars = function (str) {
            return str.replace(rgx.splChars, ' ');
        }; // removeSplChars()

        module.exports = removeSplChars;
    }, { "./util_regexes.js": 60 }], 41: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### retainAlphaNums
        /**
         *
         * Retains only apha, numerals, and removes all other characters from
         * the input string, including leading, trailing and extra in-between
         * whitespaces.
         *
         * @name string.retainAlphaNums
         * @param {string} str — the input string.
         * @return {string} input string after removal of non-alphanumeric characters,
         * leading, trailing and extra whitespaces.
         * @example
         * retainAlphaNums( ' This, text here, has  (other) chars_! ' );
         * // -> 'This text here has other chars'
         */
        var retainAlphaNums = function (str) {
            return str.replace(rgx.notAlphaNumeric, ' ').replace(rgx.spaces, ' ').trim();
        }; // retainAlphaNums()

        module.exports = retainAlphaNums;
    }, { "./util_regexes.js": 60 }], 42: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Abbreviations with `.` but are never are EOS.
        const abbrvNoEOS = Object.create(null);
        abbrvNoEOS['mr.'] = true;
        abbrvNoEOS['mrs.'] = true;
        abbrvNoEOS['ms.'] = true;
        abbrvNoEOS['er.'] = true;
        abbrvNoEOS['dr.'] = true;
        abbrvNoEOS['miss.'] = true;
        abbrvNoEOS['shri.'] = true;
        abbrvNoEOS['smt.'] = true;
        abbrvNoEOS['i.e.'] = true;
        abbrvNoEOS['ie.'] = true;
        abbrvNoEOS['e.g.'] = true;
        abbrvNoEOS['eg.'] = true;
        abbrvNoEOS['viz.'] = true;
        abbrvNoEOS['pvt.'] = true;
        // et al.
        abbrvNoEOS['et.'] = true;
        abbrvNoEOS['al.'] = true;
        // Mount Kailash!
        abbrvNoEOS['mt.'] = true;
        // Pages!
        abbrvNoEOS['pp.'] = true;

        const abbrvMayBeEOS = Object.create(null);
        abbrvMayBeEOS['inc.'] = true;
        abbrvMayBeEOS['ltd.'] = true;
        abbrvMayBeEOS['al.'] = true;
        // Regex to test potential End-Of-Sentence.
        const rgxPotentialEOS = /\.$|\!$|\?$/;
        // Regex to test special cases of "I" at eos.
        const rgxSplI = /i\?$|i\!$/;
        // Regex to test first char as alpha only
        const rgxAlphaAt0 = /^[^a-z]/i;

        // ## string

        // ### sentences
        /**
         *
         * Detects the sentence boundaries in the input `paragraph` and splits it into
         * an array of sentence(s).
         *
         * @name string.sentences
         * @param {string} paragraph — the input string.
         * @return {string[]} of sentences.
         * @example
         * sentences( 'AI Inc. is focussing on AI. I work for AI Inc. My mail is r2d2@yahoo.com' );
         * // -> [ 'AI Inc. is focussing on AI.',
         * //      'I work for AI Inc.',
         * //      'My mail is r2d2@yahoo.com' ]
         *
         * sentences( 'U.S.A is my birth place. I was born on 06.12.1924. I climbed Mt. Everest.' );
         * // -> [ 'U.S.A is my birth place.',
         * //      'I was born on 06.12.1924.',
         * //      'I climbed Mt. Everest.' ]
         */
        var punkt = function (paragraph) {
            // The basic idea is to split the paragraph on `spaces` and thereafter
            // examine each word ending with an EOS punctuation for a possible EOS.

            // Split on **space** to obtain all the `tokens` in the `para`.
            const paraTokens = paragraph.split(' ');
            var sentenceTokens = [];
            var sentences = [];

            for (let k = 0; k < paraTokens.length; k += 1) {
                // A para token.
                const pt = paraTokens[k];
                // A lower cased para token.
                const lcpt = pt.toLowerCase();
                if (rgxPotentialEOS.test(pt) && !abbrvNoEOS[lcpt] && (pt.length !== 2 || rgxAlphaAt0.test(pt) || rgxSplI.test(lcpt))) {
                    // Next para token that is non-blank.
                    let nextpt;
                    // Append this token to the current sentence tokens.
                    sentenceTokens.push(pt);
                    // If the current token is one of the abbreviations that may also mean EOS.
                    if (abbrvMayBeEOS[lcpt]) {
                        for (let j = k + 1; j < paraTokens.length && !nextpt; j += 1) {
                            nextpt = paraTokens[j];
                        }
                    }
                    // If no next para token or if present then starts from a Cap Letter then
                    // only complete sentence and start a new one!
                    if (nextpt === undefined || /^[A-Z]/.test(nextpt)) {
                        sentences.push(sentenceTokens.join(' '));
                        sentenceTokens = [];
                    }
                } else sentenceTokens.push(pt);
            }

            if (sentenceTokens.length > 0) sentences.push(sentenceTokens.join(' '));

            return sentences;
        }; // punkt()

        module.exports = punkt;
    }, {}], 43: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### soc
        /**
         *
         * Creates a set of chars from the input string `s`. This is useful
         * in even more aggressive string matching using Jaccard or Tversky compared to
         * `marker()`. It also has an alias **`soc()`**.
         *
         * @name string.setOfChars
         * @param {string} str — the input string.
         * @param {function} [ifn=undefined] — a function to build index; it receives the first
         * character of `str` and the `idx` as input arguments. The `build()` function of
         * [helper.returnIndexer](#helperreturnindexer) may be used as `ifn`. If `undefined`
         * then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string} the soc.
         * @example
         * setOfChars( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var soc = function (str, ifn, idx) {
            var cset = new Set(str);
            if (typeof ifn === 'function') {
                ifn(str[0], idx);
            }
            return cset;
        }; // soc()

        module.exports = soc;
    }, {}], 44: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### song
        /**
         *
         * Generates the set of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate set of bigrams by default.
         * It also has an alias **`song()`**.
         *
         * @name string.setOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of ngrams of `size` of `str`.
         * @example
         * setOfNGrams( 'mama' );
         * // -> Set { 'ma', 'am' }
         * song( 'mamma' );
         * // -> Set { 'ma', 'am', 'mm' }
         */
        var song = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngSet = new Set(),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    if (typeof ifn === 'function' && !ngSet.has(tg)) {
                        ifn(tg, idx);
                    }
                    ngSet.add(tg);
                }
            }
            return ngSet;
        }; // song()

        module.exports = song;
    }, {}], 45: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Soundex Code for alphabets.
        /* eslint-disable object-property-newline */
        var soundexMap = {
            A: 0, E: 0, I: 0, O: 0, U: 0, Y: 0,
            B: 1, F: 1, P: 1, V: 1,
            C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
            D: 3, T: 3,
            L: 4,
            M: 5, N: 5,
            R: 6
        };

        // ## string

        // ### soundex
        /**
         *
         * Produces the soundex code from the input `word`.
         *
         * @name string.soundex
         * @param {string} word — the input word.
         * @param {number} [maxLength=4] — of soundex code to be returned.
         * @return {string} soundex code of `word`.
         * @example
         * soundex( 'Burroughs' );
         * // -> 'B620'
         * soundex( 'Burrows' );
         * // -> 'B620'
         */
        var soundex = function (word, maxLength) {
            // Upper case right in the begining.
            var s = word.length ? word.toUpperCase() : '?';
            var i,
                imax = s.length;
            // Soundex code builds here.
            var sound = [];
            // Helpers - `ch` is a char from `s` and `code/prevCode` are sondex codes
            // for consonants.
            var ch,
                code,
                prevCode = 9;
            // Use default of 4.
            var maxLen = maxLength || 4;
            // Iterate through every character.
            for (i = 0; i < imax; i += 1) {
                ch = s[i];
                code = soundexMap[ch];
                if (i) {
                    // Means i is > 0.
                    // `code` is either (a) `undefined` if an unknown character is
                    // encountered including `h & w`, or (b) `0` if it is vowel, or
                    // (c) the soundex code for a consonant.
                    if (code && code !== prevCode) {
                        // Consonant and not adjecant duplicates!
                        sound.push(code);
                    } else if (code !== 0) {
                        // Means `h or w` or an unknown character: ensure `prevCode` is
                        // remembered so that adjecant duplicates can be handled!
                        code = prevCode;
                    }
                } else {
                    // Retain the first letter
                    sound.push(ch);
                }
                prevCode = code;
            }
            s = sound.join('');
            // Always ensure minimum length of 4 characters for maxLength > 4.
            if (s.length < 4) s += '000';
            // Return the required length.
            return s.substr(0, maxLen);
        }; // soundex()

        module.exports = soundex;
    }, {}], 46: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### splitElisions
        /**
         *
         * Splits basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it does
         * not touch apostrophe used to indicate possession.
         *
         * @name string.splitElisions
         * @param {string} str — the input string.
         * @return {string} input string after splitting of elisions.
         * @example
         * splitElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is n't it?"
         */
        var splitElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2 $3').replace(rgx.elisions1, '$1 $2').replace(rgx.elisions2, '$1 $2');
        }; // splitElisions()

        module.exports = splitElisions;
    }, { "./util_regexes.js": 60 }], 47: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var winkTokenize = require('wink-tokenizer')().tokenize;

        // ## string

        // ### tokenize
        /**
         *
         * Tokenizes the input `sentence` according to the value of `detailed` flag.
         * Any occurance of `...` in the `sentence` is
         * converted to ellipses. In `detailed = true` mode, it
         * tags every token with its type; the supported tags are currency, email,
         * emoji, emoticon, hashtag, number, ordinal, punctuation, quoted_phrase, symbol,
         * time, mention, url, and word.
         *
         * @name string.tokenize
         * @param {string} sentence — the input string.
         * @param {boolean} [detailed=false] — if true, each token is a object cotaining
         * `value` and `tag` of each token; otherwise each token is a string. It's default
         * value of **false** ensures compatibility with previous version.
         * @return {(string[]|object[])} an array of strings if `detailed` is false otherwise
         * an array of objects.
         * @example
         * tokenize( "someone's wallet, isn't it? I'll return!" );
         * // -> [ 'someone', '\'s', 'wallet', ',', 'is', 'n\'t', 'it', '?',
         * //      'I', '\'ll', 'return', '!' ]
         *
         * tokenize( 'For details on wink, check out http://winkjs.org/ URL!', true );
         * // -> [ { value: 'For', tag: 'word' },
         * //      { value: 'details', tag: 'word' },
         * //      { value: 'on', tag: 'word' },
         * //      { value: 'wink', tag: 'word' },
         * //      { value: ',', tag: 'punctuation' },
         * //      { value: 'check', tag: 'word' },
         * //      { value: 'out', tag: 'word' },
         * //      { value: 'http://winkjs.org/', tag: 'url' },
         * //      { value: 'URL', tag: 'word' },
         * //      { value: '!', tag: 'punctuation' } ]
         */
        var tokenize = function (sentence, detailed) {
            var tokens = winkTokenize(sentence.replace('...', '…'));
            var i;
            if (!detailed) {
                for (i = 0; i < tokens.length; i += 1) tokens[i] = tokens[i].value;
            }

            return tokens;
        }; // tokenize()

        module.exports = tokenize;
    }, { "wink-tokenizer": 19 }], 48: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var removeElisions = require('./string-remove-elisions.js');
        var amplifyNotElision = require('./string-amplify-not-elision.js');
        var rgx = require('./util_regexes.js');

        // ## string

        // ### tokenize0
        /**
         *
         * Tokenizes by splitting the input string on **non-words**. This means tokens would
         * consists of only alphas, numerals and underscores; all other characters will
         * be stripped as they are treated as separators. It also removes all elisions;
         * however negations are retained and amplified.
         *
         * @name string.tokenize0
         * @param {string} str — the input string.
         * @return {string[]} of tokens.
         * @example
         * tokenize0( "someone's wallet, isn't it?" );
         * // -> [ 'someone', 's', 'wallet', 'is', 'not', 'it' ]
         */
        var tokenize0 = function (str) {
            var tokens = removeElisions(amplifyNotElision(str)).replace(rgx.cannot, '$1 $2').split(rgx.nonWords);
            // Check the 0th and last element of array for empty string because if
            // fisrt/last characters are non-words then these will be empty stings!
            if (tokens[0] === '') tokens.shift();
            if (tokens[tokens.length - 1] === '') tokens.pop();
            return tokens;
        }; // tokenize0()

        module.exports = tokenize0;
    }, { "./string-amplify-not-elision.js": 26, "./string-remove-elisions.js": 36, "./util_regexes.js": 60 }], 49: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### trim
        /**
         *
         * Trims leading and trailing whitespaces from the input string.
         *
         * @name string.trim
         * @param {string} str — the input string.
         * @return {string} input string with leading & trailing whitespaces removed.
         * @example
         * trim( '  Padded   ' );
         * // -> 'Padded'
         */
        var trim = function (str) {
            return str.trim();
        }; // trim()

        module.exports = trim;
    }, {}], 50: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### upperCase
        /**
         *
         * Converts the input string to upper case.
         *
         * @name string.upperCase
         * @param {string} str — the input string.
         * @return {string} input string in upper case.
         * @example
         * upperCase( 'Upper Case' );
         * // -> 'UPPER CASE'
         */
        var upperCase = function (str) {
            return str.toUpperCase();
        }; // upperCase()

        module.exports = upperCase;
    }, {}], 51: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE SyappendBigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### appendBigrams
        /**
         *
         * Generates bigrams from the input tokens and appends them to the input tokens.
         *
         * @name tokens.appendBigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the input tokens appended with their bigrams.
         * @example
         * appendBigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he',
         * //      'acted',
         * //      'decisively',
         * //      'today',
         * //      'he_acted',
         * //      'acted_decisively',
         * //      'decisively_today' ]
         */
        var appendBigrams = function (tokens) {
            var i, imax;
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                tokens.push(tokens[i] + '_' + tokens[i + 1]);
            }
            return tokens;
        }; // appendBigrams()

        module.exports = appendBigrams;
    }, {}], 52: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Sybigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### bigrams
        /**
         *
         * Generates bigrams from the input tokens.
         *
         * @name tokens.bigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the bigrams.
         * @example
         * bigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ [ 'he', 'acted' ],
         * //      [ 'acted', 'decisively' ],
         * //      [ 'decisively', 'today' ] ]
         */
        var bigrams = function (tokens) {
            // Bigrams will be stored here.
            var bgs = [];
            // Helper variables.
            var i, imax;
            // Create bigrams.
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                bgs.push([tokens[i], tokens[i + 1]]);
            }
            return bgs;
        }; // bigrams()

        module.exports = bigrams;
    }, {}], 53: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the bag of words from the input string. By default it
         * uses `word count` as it's frequency; but if `logCounts` parameter is set to true then
         * it will use `log2( word counts + 1 )` as it's frequency. It also has an alias **`bow()`**.
         *
         * @name tokens.bagOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {number} [logCounts=false] — a true value flags the use of `log2( word count + 1 )`
         * instead of just `word count` as frequency.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of word** in `tokens`; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of words from tokens.
         * @example
         * bagOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> { rain: 2, go: 1, away: 1 }
         * bow( [ 'rain', 'rain', 'go', 'away' ], true );
         * // -> { rain: 1.584962500721156, go: 1, away: 1 }
         */
        var bow = function (tokens, logCounts, ifn, idx) {
            var bow1 = Object.create(null),
                i,
                imax,
                token,
                words;
            for (i = 0, imax = tokens.length; i < imax; i += 1) {
                token = tokens[i];
                if (typeof ifn === 'function' && !bow1[token]) {
                    ifn(token, idx);
                }
                bow1[token] = 1 + (bow1[token] || 0);
            }
            if (!logCounts) return bow1;
            words = Object.keys(bow1);
            for (i = 0, imax = words.length; i < imax; i += 1) {
                // Add `1` to ensure non-zero count! (Note: log2(1) is 0)
                bow1[words[i]] = Math.log2(bow1[words[i]] + 1);
            }
            return bow1;
        }; // bow()

        module.exports = bow;
    }, {}], 54: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringPhonetize = require('./string-phonetize.js');

        // ## tokens

        // ### phonetize
        /**
         *
         * Phonetizes input tokens using using an algorithmic adaptation of Metaphone.
         *
         * @name tokens.phonetize
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} phonetized tokens.
         * @example
         * phonetize( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'h', 'aktd', 'dssvl', 'td' ]
         */
        var phonetize = function (tokens) {
            return tokens.map(stringPhonetize);
        }; // phonetize()

        module.exports = phonetize;
    }, { "./string-phonetize.js": 35 }], 55: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### propagateNegations
        /**
         *
         * It looks for negation tokens in the input array of tokens and propagates
         * negation to subsequent `upto` tokens by prefixing them by a `!`. It is useful
         * in handling text containing negations during tasks like similarity detection,
         * classification or search.
         *
         * @name tokens.propagateNegations
         * @param {string[]} tokens — the input tokens.
         * @param {number} [upto=2] — number of tokens to be negated after the negation
         * token. Note, tokens are only negated either `upto` tokens or up to the token
         * preceeding the **`, . ; : ! ?`** punctuations.
         * @return {string[]} tokens with negation propagated.
         * @example
         * propagateNegations( [ 'mary', 'is', 'not', 'feeling', 'good', 'today' ] );
         * // -> [ 'mary', 'is', 'not', '!feeling', '!good', 'today' ]
         */
        var propagateNegations = function (tokens, upto) {
            var i, imax, j, jmax;
            var tkns = tokens;
            var limit = upto || 2;
            for (i = 0, imax = tkns.length; i < imax; i += 1) {
                if (rgx.negations.test(tkns[i])) {
                    for (j = i + 1, jmax = Math.min(imax, i + limit + 1); j < jmax; j += 1) {
                        // Hit a punctuation mark, break out of the loop otherwise go *upto the limit*.
                        // > TODO: promote to utilities regex, after test cases have been added.
                        if (/[\,\.\;\:\!\?]/.test(tkns[j])) break;
                        // Propoage negation: invert the token by prefixing a `!` to it.
                        tkns[j] = '!' + tkns[j];
                    }
                    i = j;
                }
            }
            return tkns;
        }; // propagateNegations()

        module.exports = propagateNegations;
    }, { "./util_regexes.js": 60 }], 56: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        var defaultStopWords = require('./dictionaries/stop_words.json');
        var words = require('./helper-return-words-filter.js');
        defaultStopWords = words(defaultStopWords);

        // ## tokens

        // ### removeWords
        /**
         *
         * Removes the stop words from the input array of tokens.
         *
         * @name tokens.removeWords
         * @param {string[]} tokens — the input tokens.
         * @param {wordsFilter} [stopWords=defaultStopWords] — default stop words are
         * loaded from `stop_words.json` located under the `src/dictionaries/` directory.
         * Custom stop words can be created using [helper.returnWordsFilter ](#helperreturnwordsfilter).
         * @return {string[]} balance tokens.
         * @example
         * removeWords( [ 'this', 'is', 'a', 'cat' ] );
         * // -> [ 'cat' ]
         */
        var removeWords = function (tokens, stopWords) {
            var givenStopWords = stopWords || defaultStopWords;
            return tokens.filter(givenStopWords.exclude);
        }; // removeWords()

        module.exports = removeWords;
    }, { "./dictionaries/stop_words.json": 20, "./helper-return-words-filter.js": 23 }], 57: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringSoundex = require('./string-soundex.js');

        // ## tokens

        // ### soundex
        /**
         *
         * Generates the soundex coded tokens from the input tokens.
         *
         * @name tokens.soundex
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} soundex coded tokens.
         * @example
         * soundex( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'H000', 'A233', 'D221', 'T300' ]
         */
        var soundex = function (tokens) {
            // Need to send `maxLength` as `undefined`.
            return tokens.map(t => stringSoundex(t));
        }; // soundex()

        module.exports = soundex;
    }, { "./string-soundex.js": 45 }], 58: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the set of words from the input string. It also has an alias **`setOfWords()`**.
         *
         * @name tokens.setOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **member word of the set **; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of words from tokens.
         * @example
         * setOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> Set { 'rain', 'go', 'away' }
         */
        var sow = function (tokens, ifn, idx) {
            var tset = new Set(tokens);
            if (typeof ifn === 'function') {
                tset.forEach(function (m) {
                    ifn(m, idx);
                });
            }
            return tset;
        }; // bow()

        module.exports = sow;
    }, {}], 59: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ## tokens

        // ### stem
        /**
         *
         * Stems input tokens using Porter Stemming Algorithm Version 2.
         *
         * @name tokens.stem
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} stemmed tokens.
         * @example
         * stem( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he', 'act', 'decis', 'today' ]
         */
        var stem = function (tokens) {
            return tokens.map(porter2Stemmer);
        }; // stem()

        module.exports = stem;
    }, { "wink-porter2-stemmer": 62 }], 60: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = Object.create(null);

        // Matches standard english punctuations in a text.
        rgx.punctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:]/ig;
        // End Of Sentence Punctuations - useful for splitting text into sentences.
        rgx.eosPunctuations = /([\.\?\!])\s*(?=[a-z]|\s+\d)/gi;

        // Matches special characters: `* + % # @ ^ = ~ | \` in a text.
        rgx.splChars = /[\*\+\%\#\@\^\=\~\|\\]/ig;

        // Matches common english elisions including n't.
        // These are special ones as 's otherwise may be apostrophe!
        rgx.elisionsSpl = /(\b)(it|let|that|who|what|here|there|when|where|why|how)(\'s)\b/gi;
        // Single (1) character elisions.
        rgx.elisions1 = /([a-z])(\'d|\'m)\b/gi;
        // Two (2) character elisions.
        rgx.elisions2 = /([a-z])(\'ll|\'ve|\'re|n\'t)\b/gi;
        // Sperate not elision 'nt.
        rgx.notElision = /([a-z])(n\'t)\b/gi;
        // Specially handle cannot
        rgx.cannot = /\b(can)(not)\b/gi;

        // Matches space, tab, or new line characters in text.
        rgx.spaces = /\s+/ig;
        // Matches anything other than space, tab, or new line characters.
        rgx.notSpace = /\S/g;
        // Matches alpha and space characters in a text.
        rgx.alphaSpace = /[a-z\s]/ig;
        // Matches alphanumerals and space characters in a text.
        rgx.alphaNumericSpace = /[a-z0-9\s]/ig;
        // Matches non alpha characters in a text.
        rgx.notAlpha = /[^a-z]/ig;
        // Matches non alphanumerals in a text.
        rgx.notAlphaNumeric = /[^a-z0-9]/ig;
        // Matches one or more non-words characters.
        rgx.nonWords = /\W+/ig;
        // Matches complete negation token
        rgx.negations = /^(never|none|not|no)$/ig;

        // Matches run of capital words in a text.
        rgx.rocWords = /(?:\b[A-Z][A-Za-z]*\s*){2,}/g;

        // Matches integer, decimal, JS floating point numbers in a text.
        rgx.number = /[0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+/ig;

        // Matches time in 12 hour am/pm format in a text.
        rgx.timeIn12HrAMPM = /(?:[0-9]|0[0-9]|1[0-2])((:?:[0-5][0-9])){0,1}\s?(?:[aApP][mM])/ig;

        // Matches HTML tags - in fact any thing enclosed in angular brackets including
        // the brackets.
        rgx.htmlTags = /(?:<[^>]*>)/g;
        // Matches the HTML Esc Sequences
        // Esc Seq of type `&lt;` or `&nbsp;`
        rgx.htmlEscSeq1 = /(?:&[a-z]{2,6};)/gi;
        // Esc Seq of type `&#32;`
        rgx.htmlEscSeq2 = /(?:&#[0-9]{2,4};)/gi;

        // Tests if a given string is possibly in the Indian mobile telephone number format.
        rgx.mobileIndian = /^(0|\+91)?[789]\d{9}$/;
        // Tests if a given string is in the valid email format.
        rgx.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Extracts any number and text from a <number><text> format text.
        // Useful in extracting value and UoM from strings like `2.7 Kgs`.
        rgx.separateNumAndText = /([0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+)[\s]*(.*)/i;

        // Crude date parser for a string containg date in a valid format.
        // > TODO: Need to improve this one!
        rgx.date = /(\d+)/ig;

        // Following 3 regexes are specially coded for `tokenize()` in prepare_text.
        // Matches punctuations that are not a part of a number.
        rgx.nonNumPunctuations = /[\.\,\-](?=\D)/gi;
        rgx.otherPunctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\!\;\?\/\:]/ig;
        // > TODO: Add more currency symbols here.
        rgx.currency = /[\$\£\¥\€]/ig;

        //
        module.exports = rgx;
    }, {}], 61: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ### Prepare Name Space

        // Create prepare name space.
        var prepare = Object.create(null);

        // ### Prepare.Helper name space

        // Create prepare.helper name space.
        prepare.helper = Object.create(null);

        // Words
        prepare.helper.words = require('./helper-return-words-filter.js');
        // Make better **alias** name for the `word()` function.
        prepare.helper.returnWordsFilter = prepare.helper.words;
        // Index
        prepare.helper.index = require('./helper-return-indexer.js');
        // Make better **alias** name for the `index()` function.
        prepare.helper.returnIndexer = prepare.helper.index;

        // Return Quoted Text Extractor
        prepare.helper.returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');

        // ### Prepare.String Name Space

        // Create prepare.string name space.
        prepare.string = Object.create(null);

        // Lower Case
        prepare.string.lowerCase = require('./string-lower-case.js');
        // Upper Case
        prepare.string.upperCase = require('./string-upper-case.js');
        // Trim
        prepare.string.trim = require('./string-trim.js');
        // Remove Extra Spaces
        prepare.string.removeExtraSpaces = require('./string-remove-extra-spaces.js');
        // Retain Alpha-numerics
        prepare.string.retainAlphaNums = require('./string-retain-alpha-nums.js');
        // Extract Person's Name
        prepare.string.extractPersonsName = require('./string-extract-persons-name.js');
        // Extract Run of Capital Words
        prepare.string.extractRunOfCapitalWords = require('./string-extract-run-of-capital-words.js');
        // Remove Punctuations
        prepare.string.removePunctuations = require('./string-remove-punctuations.js');
        // Remove Special Chars
        prepare.string.removeSplChars = require('./string-remove-spl-chars.js');
        // Remove HTML Tags
        prepare.string.removeHTMLTags = require('./string-remove-html-tags.js');
        // Remove Elisions
        prepare.string.removeElisions = require('./string-remove-elisions.js');
        // Split Elisions
        prepare.string.splitElisions = require('./string-split-elisions.js');
        // Amplify Not Elision
        prepare.string.amplifyNotElision = require('./string-amplify-not-elision');
        // Marker
        prepare.string.marker = require('./string-marker.js');
        // SOC
        prepare.string.soc = require('./string-soc.js');
        prepare.string.setOfChars = require('./string-soc.js');
        // NGrams
        prepare.string.ngrams = require('./string-ngram.js');
        // Edge NGrams
        prepare.string.edgeNGrams = require('./string-edge-ngrams.js');
        // BONG
        prepare.string.bong = require('./string-bong.js');
        prepare.string.bagOfNGrams = require('./string-bong.js');
        // SONG
        prepare.string.song = require('./string-song.js');
        prepare.string.setOfNGrams = require('./string-song.js');
        // Sentences
        prepare.string.sentences = require('./string-sentences.js');
        // Compose Corpus
        prepare.string.composeCorpus = require('./string-compose-corpus.js');
        // Tokenize0
        prepare.string.tokenize0 = require('./string-tokenize0.js');
        // Tokenize
        prepare.string.tokenize = require('./string-tokenize.js');
        // #### Stem
        prepare.string.stem = porter2Stemmer;
        // Phonetize
        prepare.string.phonetize = require('./string-phonetize.js');
        // Soundex
        prepare.string.soundex = require('./string-soundex.js');

        // ### Prepare.Tokens Name Space

        // Create prepare.tokens name space.
        prepare.tokens = Object.create(null);

        // Stem
        prepare.tokens.stem = require('./tokens-stem.js');
        // Phonetize
        prepare.tokens.phonetize = require('./tokens-phonetize.js');
        // Soundex
        prepare.tokens.soundex = require('./tokens-soundex.js');
        // Remove Words
        prepare.tokens.removeWords = require('./tokens-remove-words.js');
        // BOW
        prepare.tokens.bow = require('./tokens-bow.js');
        prepare.tokens.bagOfWords = require('./tokens-bow.js');
        // SOW
        prepare.tokens.sow = require('./tokens-sow.js');
        prepare.tokens.setOfWords = require('./tokens-sow.js');
        // Propagate Negations
        prepare.tokens.propagateNegations = require('./tokens-propagate-negations.js');
        // Bigrams
        prepare.tokens.bigrams = require('./tokens-bigrams.js');
        // Append Bigrams
        prepare.tokens.appendBigrams = require('./tokens-append-bigrams.js');

        // Export prepare.
        module.exports = prepare;
    }, { "./helper-return-indexer.js": 21, "./helper-return-quoted-text-extractor.js": 22, "./helper-return-words-filter.js": 23, "./string-amplify-not-elision": 26, "./string-bong.js": 27, "./string-compose-corpus.js": 28, "./string-edge-ngrams.js": 29, "./string-extract-persons-name.js": 30, "./string-extract-run-of-capital-words.js": 31, "./string-lower-case.js": 32, "./string-marker.js": 33, "./string-ngram.js": 34, "./string-phonetize.js": 35, "./string-remove-elisions.js": 36, "./string-remove-extra-spaces.js": 37, "./string-remove-html-tags.js": 38, "./string-remove-punctuations.js": 39, "./string-remove-spl-chars.js": 40, "./string-retain-alpha-nums.js": 41, "./string-sentences.js": 42, "./string-soc.js": 43, "./string-song.js": 44, "./string-soundex.js": 45, "./string-split-elisions.js": 46, "./string-tokenize.js": 47, "./string-tokenize0.js": 48, "./string-trim.js": 49, "./string-upper-case.js": 50, "./tokens-append-bigrams.js": 51, "./tokens-bigrams.js": 52, "./tokens-bow.js": 53, "./tokens-phonetize.js": 54, "./tokens-propagate-negations.js": 55, "./tokens-remove-words.js": 56, "./tokens-soundex.js": 57, "./tokens-sow.js": 58, "./tokens-stem.js": 59, "wink-porter2-stemmer": 62 }], 62: [function (require, module, exports) {
        //     wink-porter2-stemmer
        //     Implementation of Porter Stemmer Algorithm V2 by Dr Martin F Porter
        //
        //     Copyright (C) 2017  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-porter2-stemmer”.
        //
        //     “wink-porter2-stemmer” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-porter2-stemmer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-porter2-stemmer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        // Implements the Porter Stemmer Algorithm V2 by Dr Martin F Porter.
        // Reference: https://snowballstem.org/algorithms/english/stemmer.html

        // ## Regex Definitions

        // Regex definition of `double`.
        var rgxDouble = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/;
        // Definition for Step Ia suffixes.
        var rgxSFXsses = /(.+)(sses)$/;
        var rgxSFXiedORies2 = /(.{2,})(ied|ies)$/;
        var rgxSFXiedORies1 = /(.{1})(ied|ies)$/;
        var rgxSFXusORss = /(.+)(us|ss)$/;
        var rgxSFXs = /(.+)(s)$/;
        // Definition for Step Ib suffixes.
        var rgxSFXeedlyOReed = /(.*)(eedly|eed)$/;
        var rgxSFXedORedlyORinglyORing = /([aeiouy].*)(ed|edly|ingly|ing)$/;
        var rgxSFXatORblORiz = /(at|bl|iz)$/;
        // Definition for Step Ic suffixes.
        var rgxSFXyOR3 = /(.+[^aeiouy])([y3])$/;
        // Definition for Step II suffixes; note we have spot the longest suffix.
        var rgxSFXstep2 = /(ization|ational|fulness|ousness|iveness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|ogi|li)$/;
        var rgxSFXstep2WithReplacements = [
            // Length 7.
            { rgx: /ational$/, replacement: 'ate' }, { rgx: /ization$/, replacement: 'ize' }, { rgx: /fulness$/, replacement: 'ful' }, { rgx: /ousness$/, replacement: 'ous' }, { rgx: /iveness$/, replacement: 'ive' },
            // Length 6.
            { rgx: /tional$/, replacement: 'tion' }, { rgx: /biliti$/, replacement: 'ble' }, { rgx: /lessli$/, replacement: 'less' },
            // Length 5.
            { rgx: /iviti$/, replacement: 'ive' }, { rgx: /ousli$/, replacement: 'ous' }, { rgx: /ation$/, replacement: 'ate' }, { rgx: /entli$/, replacement: 'ent' }, { rgx: /(.*)(alism|aliti)$/, replacement: '$1al' }, { rgx: /fulli$/, replacement: 'ful' },
            // Length 4.
            { rgx: /alli$/, replacement: 'al' }, { rgx: /ator$/, replacement: 'ate' }, { rgx: /izer$/, replacement: 'ize' }, { rgx: /enci$/, replacement: 'ence' }, { rgx: /anci$/, replacement: 'ance' }, { rgx: /abli$/, replacement: 'able' },
            // Length 3.
            { rgx: /bli$/, replacement: 'ble' }, { rgx: /(.*)(l)(ogi)$/, replacement: '$1$2og' },
            // Length 2.
            { rgx: /(.*)([cdeghkmnrt])(li)$/, replacement: '$1$2' }];
        // Definition for Step III suffixes; once again spot the longest one first!
        var rgxSFXstep3 = /(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/;
        var rgxSFXstep3WithReplacements = [{ rgx: /ational$/, replacement: 'ate' }, { rgx: /tional$/, replacement: 'tion' }, { rgx: /alize$/, replacement: 'al' }, { rgx: /(.*)(icate|iciti|ical)$/, replacement: '$1ic' }, { rgx: /(ness|ful)$/, replacement: '' }];
        // Definition for Step IV suffixes.
        var rgxSFXstep4 = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|al|er|ic)$/;
        var rgxSFXstep4Full = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|ion|al|er|ic)$/;
        var rgxSFXstep4ion = /(.*)(s|t)(ion)$/;
        // Exceptions Set I.
        var exceptions1 = {
            // Mapped!
            'skis': 'ski',
            'skies': 'sky',
            'dying': 'die',
            'lying': 'lie',
            'tying': 'tie',
            'idly': 'idl',
            'gently': 'gentl',
            'ugly': 'ugli',
            'early': 'earli',
            'only': 'onli',
            'singly': 'singl',
            // Invariants!
            'sky': 'sky',
            'news': 'news',
            'atlas': 'atlas',
            'cosmos': 'cosmos',
            'bias': 'bias',
            'andes': 'andes'
        };
        // Exceptions Set II.
        // Note, these are to be treated as full words.
        var rgxException2 = /^(inning|outing|canning|herring|proceed|exceed|succeed|earring)$/;

        // ## Private functions

        // ### prelude
        /**
         * Performs initial pre-processing by transforming the input string `s` as
         * per the replacements.
         *
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var prelude = function (s) {
            return s
                // Handle `y`'s.
                .replace(/^y/, '3').replace(/([aeiou])y/, '$13')
                // Handle apostrophe.
                .replace(/\’s$|\'s$/, '').replace(/s\’$|s\'$/, '').replace(/[\’\']$/, '');
        }; // prelude()

        // ### isShort
        /**
         * @param {String} s Input string
         * @return {Boolean} `true` if `s` is a short syllable, `false` otherwise
         * @private
         */
        var isShort = function (s) {
            // (a) a vowel followed by a non-vowel other than w, x or 3 and
            // preceded by a non-vowel, **or** (b) a vowel at the beginning of the word
            // followed by a non-vowel.
            return (/[^aeiouy][aeiouy][^aeiouywx3]$/.test(s) || /^[aeiouy][^aeiouy]{0,1}$/.test(s) // Removed this new changed??

            );
        }; // isShort()

        // ### markRegions
        /**
         * @param {String} s Input string
         * @return {Object} the `R1` and `R2` regions as an object from the input string `s`.
         * @private
         */
        var markRegions = function (s) {
            // Matches of `R1` and `R2`.
            var m1, m2;
            // To detect regions i.e. `R1` and `R2`.
            var rgxRegions = /[aeiouy]+([^aeiouy]{1}.+)/;
            m1 = rgxRegions.exec(s);
            if (!m1) return { r1: '', r2: '' };
            m1 = m1[1].slice(1);
            // Handle exceptions here to prevent over stemming.
            m1 = /^(gener|commun|arsen)/.test(s) ? s.replace(/^(gener|commun|arsen)(.*)/, '$2') : m1;
            m2 = rgxRegions.exec(m1);
            if (!m2) return { r1: m1, r2: '' };
            m2 = m2[1].slice(1);
            return { r1: m1, r2: m2 };
        }; // markRegions()

        // ### step1a
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1a = function (s) {
            var wordPart;
            if (rgxSFXsses.test(s)) return s.replace(rgxSFXsses, '$1ss');
            if (rgxSFXiedORies2.test(s)) return s.replace(rgxSFXiedORies2, '$1i');
            if (rgxSFXiedORies1.test(s)) return s.replace(rgxSFXiedORies1, '$1ie');
            if (rgxSFXusORss.test(s)) return s;
            wordPart = s.replace(rgxSFXs, '$1');
            if (/[aeiuouy](.+)$/.test(wordPart)) return s.replace(rgxSFXs, '$1');
            return s;
        }; // step1a()

        // ### step1b
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1b = function (s) {
            var rgn = markRegions(s),
                sd;
            // Search for the longest among the `eedly|eed` suffixes.
            if (rgxSFXeedlyOReed.test(s))
                // Replace by ee if in R1.
                return rgxSFXeedlyOReed.test(rgn.r1) ? s.replace(rgxSFXeedlyOReed, '$1ee') : s;
            // Delete `ed|edly|ingly|ing` if the preceding word part contains a vowel.
            if (rgxSFXedORedlyORinglyORing.test(s)) {
                sd = s.replace(rgxSFXedORedlyORinglyORing, '$1');
                rgn = markRegions(sd);
                // And after deletion, return either
                return rgxSFXatORblORiz.test(sd) ? sd + 'e' :
                    // or
                    rgxDouble.test(sd) ? sd.replace(/.$/, '') :
                        // or
                        isShort(sd) && rgn.r1 === '' ? sd + 'e' :
                            // or
                            sd;
            }
            return s;
        }; // step1b()

        // ### step1c
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1c = function (s) {
            return s.replace(rgxSFXyOR3, '$1i');
        }; // step1c()

        // ### step2
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step2 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep2);
            match = match === null ? '$$$$$' : match[1];
            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep2WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep2WithReplacements[i].rgx, rgxSFXstep2WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
            }
            return s;
        }; // step2()

        // ### step3
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step3 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep3);
            match = match === null ? '$$$$$' : match[1];

            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep3WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep3WithReplacements[i].rgx, rgxSFXstep3WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
                if (/ative/.test(rgn.r2)) return s.replace(/ative$/, '');
            }
            return s;
        }; // step3()

        // ### step4
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step4 = function (s) {
            var rgn = markRegions(s);
            var match = s.match(rgxSFXstep4Full);
            match = match === null ? '$$$$$' : match[1];
            if (rgxSFXstep4Full.test(s) && rgn.r2.indexOf(match) !== -1) {
                return rgxSFXstep4.test(s) ? s.replace(rgxSFXstep4, '') : rgxSFXstep4ion.test(s) ? s.replace(rgxSFXstep4ion, '$1$2') : s;
            }
            return s;
        }; // step4()

        // ### step5
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step5 = function (s) {
            var preceding, rgn;
            // Search for the `e` suffixes.
            rgn = markRegions(s);
            if (/e$/i.test(s)) {
                preceding = s.replace(/e$/, '');
                return (
                    // Found: delete if in R2, or in R1 and not preceded by a short syllable
                    /e/.test(rgn.r2) || /e/.test(rgn.r1) && !isShort(preceding) ? preceding : s
                );
            }
            // Search for the `l` suffixes.
            if (/l$/.test(s)) {
                rgn = markRegions(s);
                // Found: delete if in R2
                return rgn.r2 && /l$/.test(rgn.r2) ? s.replace(/ll$/, 'l') : s;
            }
            // If nothing happens, must return the string!
            return s;
        }; // step5()

        // ## Public functions
        // ### stem
        /**
         *
         * Stems an inflected `word` using Porter2 stemming algorithm.
         *
         * @param {string} word — word to be stemmed.
         * @return {string} — the stemmed word.
         *
         * @example
         * stem( 'consisting' );
         * // -> consist
         */
        var stem = function (word) {
            var str = word.toLowerCase();
            if (str.length < 3) return str;
            if (exceptions1[str]) return exceptions1[str];
            str = prelude(str);
            str = step1a(str);

            if (!rgxException2.test(str)) {
                str = step1b(str);
                str = step1c(str);
                str = step2(str);
                str = step3(str);
                str = step4(str);
                str = step5(str);
            }

            str = str.replace(/3/g, 'y');
            return str;
        }; // stem()

        // Export stem function.
        module.exports = stem;
    }, {}]
}, {}, [2]);
