/*

    RapidDOM

    Copyright 2018 dr1ft
    
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    https://github.com/strdr1ft/RapidDOM

*/

(() => {

    // shorthand stuff
    window.$ = s => document.querySelector(s);
    window.$$ = s => document.querySelectorAll(s);
    window.createElement = t => document.createElement(t);

    // get HTMLElement's prototype so that we can work with it
    var element = HTMLElement.prototype;

    element.modify = function (c) {
        c(this);
        return this;
    };

    // set the id
    element.withId = function (id) {
        this.id = id;
        return this;
    };

    // add classes to an element
    element.withClass = function (...classes) {

        // iterate over the arguments and add them all to the classlist
        for (var i = 0; i < classes.length; i++) {
            var subclasses = classes[i].split(' ');
            for (var j = 0; j < subclasses.length; j++) {
                this.classList.add(subclasses[j]);
            }
        }

        return this;

    };

    element.withAttribute = function (name, value) {
        this.setAttribute(name, value);
        return this;
    }

    // set the text
    element.withText = function (text) {
        this.innerText = text;
        return this;
    };

    // set the html !!! NOT SAFE !!!
    element.withContents = function (text) {
        this.innerHTML = text;
        return this;
    };

    element.withChildren = function (...children) {
        for (var i = 0; i < children.length; i++) {
            this.appendChild(children[i]);
        }
        return this;
    };

    element.appendTo = function (parent) {
        parent.appendChild(this);
        return this;
    };

    // wipe the innerHTML of an element
    element.purge = function () {
        this.innerHTML = '';
        return this;
    };

})();