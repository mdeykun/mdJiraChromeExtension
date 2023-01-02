let app = {
    start: async function() {
        this.injectScriptFromFile('mdjeUtility.js');
    },

    injectScriptFromFile: function(fileName) {
        let file = chrome.runtime.getURL(fileName);
        let tag = document.createElement('script');
        tag.setAttribute('type', 'text/javascript');
        tag.setAttribute('src', file);
        
        document.body.appendChild(tag);
    },
};

app.start();