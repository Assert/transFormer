
/*
transFormer.js Framwork - Easy binding of form-data
*/

var transFormer = {
    separator: " ",

    // Gets value of attribute data-object, used for sub-objects like asset
    getDataObject: function(elem) {
        var dataObject = null;

        for (var i = 0; i < elem.attributes.length; i++) {
            if (elem.attributes[i].nodeName === "data-object") {
                dataObject = elem.attributes[i].nodeValue;
                break;
            }
        }
        return dataObject;
    },

    // Gets value of attribute data-array, used for arrays of objects
    getDataArrayDescriptor: function(elem) {
        var dataArrayDescriptor = null;

        for (var i = 0; i < elem.attributes.length; i++) {
            if (elem.attributes[i].nodeName === "data-array") {
                dataArrayDescriptor = elem.attributes[i].nodeValue;
                break;
            }
        }
        return dataArrayDescriptor;
    },

    populateModel: function(formData) {

        var eventModel = function() {

            this.makeObjectArrayFromString = function(str, descriptor) {
                str = $.trim(str);
                var arr = str.split(this.separator);
                for (var x = 0; x < arr.length; x++) {
                    var qq = $.trim(arr[x]);
                    arr[x] = {};
                    arr[x][descriptor] = qq;
                }
                return arr;
            };
        };

        var event = new eventModel();

        for (var i = 0; i < formData.length; i++) {
            var elem = formData[i];

            var value = elem.value;
            if (value === "") value = null;


            var arrDescriptor = this.getDataArrayDescriptor(elem);
            if (arrDescriptor !== null) {
                value = event.makeObjectArrayFromString(value, arrDescriptor);
            }

            var obj = this.getDataObject(elem);
            if (obj !== null) {
                if (typeof(event[obj]) === "undefined") {
                    event[obj] = {};
                }
                event[obj][elem.id] = value;
            } else {
                event[elem.id] = value;
            }
        }
        return event;
    },

    bind: function(data, rootElemId) {
        var rootElem = document;
        if (rootElemId !== null) {
            rootElem = document.getElementById(rootElemId);
        }
        var allTags = rootElem.getElementsByTagName("*");

        for (var i = 0; i < allTags.length; i++) {
            var elem = allTags[i];

            var propName = elem.className;

            if (propName === "id") propName = "Id";

            var verdi = data[propName];

            if (typeof(verdi) === "undefined") {
                // Sub object
                var objName = this.getDataObject(elem);

                try {
                    verdi = data[objName][propName];
                } catch(e) {
                    // html-element not found in data model
                    continue;
                }
            }

            if (typeof(verdi) === "object") {
                // Array of objects
                var str = "";
                var descriptor = this.getDataArrayDescriptor(elem);
                for (var j = 0; j < verdi.length; j++) {
                    str += verdi[j][descriptor] + this.separator;
                }
                verdi = str;
            }

            if (elem.tagName === "DIV" || elem.tagName === "P" || elem.tagName === "H1" || elem.tagName === "H2") {
                elem.innerHTML = verdi;
            }
            if (elem.tagName === "IMG") {
                elem.src = verdi;
            }
            if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
                if (elem.type === 'checkbox') {
                    elem.checked = verdi; // true false
                } else if (elem.type === 'radio') {
                    elem.checked = verdi; // true false
                } else {
                    elem.value = verdi;
                }
            }

            if (elem.tagName === "SELECT") {
                //var strUser = elem.options[elem.selectedIndex].value;
                elem.value = verdi;
            }
        }
    },

    bindToTemplate: function(data, template, destination) {

        var rootElem = document.getElementById(template);
        for (var i = 0; i <= data.length - 1; i++) {
            var dup = this.duplicate(rootElem);
            this.addDuplicateToPage(dup, destination);
            this.bind(data[i], dup.id);
        }

        //// Clear template
        //while (rootElem.hasChildNodes()) {
        //    rootElem.removeChild(rootElem.lastChild);
        //}
        //// Clear all attributes
        //for (var j = rootElem.attributes.length; j-- > 0;)
        //    rootElem.removeAttributeNode(rootElem.attributes[j]);

        // Todo: I can clear all children end attributes from the template, then use that elemet as source.

        rootElem.style.display = 'none';


    },
    duplicate: function (rootElem) {
        var dupNode = rootElem.cloneNode(true);
        dupNode.id = this.guid();
        return dupNode;
    },
    addDuplicateToPage: function (duplicate, destination) {
        document.getElementById(destination).appendChild(duplicate);
    },
    guid: function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    },
    s4: function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
};
