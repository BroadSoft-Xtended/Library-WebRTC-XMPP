(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root === 'undefined' || root !== Object(root)) {
        throw new Error('templatizer: window does not exist or is not an object');
    } else {
        root.templatizer = factory();
    }
}(this, function () {
    var jade=function(){function n(n){return null!=n&&""!==n}function t(e){return(Array.isArray(e)?e.map(t):e&&"object"==typeof e?Object.keys(e).filter(function(n){return e[n]}):[e]).filter(n).join(" ")}function e(n){return i[n]||n}function r(n){var t=String(n).replace(o,e);return t===""+n?n:t}var a={};a.merge=function s(t,e){if(1===arguments.length){for(var r=t[0],a=1;a<t.length;a++)r=s(r,t[a]);return r}var i=t["class"],o=e["class"];(i||o)&&(i=i||[],o=o||[],Array.isArray(i)||(i=[i]),Array.isArray(o)||(o=[o]),t["class"]=i.concat(o).filter(n));for(var f in e)"class"!=f&&(t[f]=e[f]);return t},a.joinClasses=t,a.cls=function(n,e){for(var r=[],i=0;i<n.length;i++)e&&e[i]?r.push(a.escape(t([n[i]]))):r.push(t(n[i]));var o=t(r);return o.length?' class="'+o+'"':""},a.style=function(n){return n&&"object"==typeof n?Object.keys(n).map(function(t){return t+":"+n[t]}).join(";"):n},a.attr=function(n,t,e,r){return"style"===n&&(t=a.style(t)),"boolean"==typeof t||null==t?t?" "+(r?n:n+'="'+n+'"'):"":0==n.indexOf("data")&&"string"!=typeof t?(-1!==JSON.stringify(t).indexOf("&")&&console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes will be escaped to `&amp;`"),t&&"function"==typeof t.toISOString&&console.warn("Jade will eliminate the double quotes around dates in ISO form after 2.0.0")," "+n+"='"+JSON.stringify(t).replace(/'/g,"&apos;")+"'"):e?(t&&"function"==typeof t.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+n+'="'+a.escape(t)+'"'):(t&&"function"==typeof t.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+n+'="'+t+'"')},a.attrs=function(n,e){var r=[],i=Object.keys(n);if(i.length)for(var o=0;o<i.length;++o){var s=i[o],f=n[s];"class"==s?(f=t(f))&&r.push(" "+s+'="'+f+'"'):r.push(a.attr(s,f,!1,e))}return r.join("")};var i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"},o=/[&<>"]/g;return a.escape=r,a.rethrow=function f(n,t,e,r){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&t||r))throw n.message+=" on line "+e,n;try{r=r||require("fs").readFileSync(t,"utf8")}catch(a){f(n,null,e)}var i=3,o=r.split("\n"),s=Math.max(e-i,0),l=Math.min(o.length,e+i),i=o.slice(s,l).map(function(n,t){var r=t+s+1;return(r==e?"  > ":"    ")+r+"| "+n}).join("\n");throw n.path=t,n.message=(t||"Jade")+":"+e+"\n"+i+"\n\n"+n.message,n},a.DebugItem=function(n,t){this.lineno=n,this.filename=t},a}();

    var templatizer = {};


    // addcontact.jade compiled template
    templatizer["addcontact"] = function tmpl_addcontact() {
        return '<div class="addcontact"><div><a class="addLink">+ Add Contact</a><a class="cancelLink">Cancel</a></div><div class="form"><div class="table fixed"><div class="row"><span class="cell">Account ID</span><input type="text" class="cell jid"/></div><div class="row"><span class="cell">Name</span><input type="text" class="cell name"/></div></div><div><button class="button add">Add</button></div></div></div>';
    };

    // chat.jade compiled template
    templatizer["chat"] = function tmpl_chat() {
        return '<div class="chat"><div class="name"></div><div class="messagesContent"></div><textarea placeholder="Type a message here" class="input"></textarea></div>';
    };

    // chats.jade compiled template
    templatizer["chats"] = function tmpl_chats() {
        return '<div class="chatsView"><div class="chatsContent"></div><div class="chatTabHolder"></div></div>';
    };

    // chattab.jade compiled template
    templatizer["chattab"] = function tmpl_chattab() {
        return '<div class="chatTab"><div class="chatTabContent"></div></div>';
    };

    // contact.jade compiled template
    templatizer["contact"] = function tmpl_contact() {
        return '<div class="contact classes"><a class="close"><i class="icon-im-cancel2"></i></a><span class="presence icon-im-circle"></span><span class="name"></span><a class="remove"><i class="icon-im-cancel2"></i></a></div>';
    };

    // contacts.jade compiled template
    templatizer["contacts"] = function tmpl_contacts() {
        return '<div class="contactsView"><div class="removeContactFailed error"></div><div class="myContactHolder"></div><div class="addContactHolder"></div><div class="contactsContent"></div></div>';
    };

    // message.jade compiled template
    templatizer["message"] = function tmpl_message() {
        return '<div class="message"><span class="body"></span></div>';
    };

    // mycontact.jade compiled template
    templatizer["mycontact"] = function tmpl_mycontact() {
        return '<div class="mycontact"><span class="presence"></span><span class="name"></span><select class="presenceSelect"></select></div>';
    };

    // subscription.jade compiled template
    templatizer["subscription"] = function tmpl_subscription() {
        return '<div class="subscription"><span class="name"></span><button class="accept button">Accept</button><button class="deny button">Deny</button></div>';
    };

    // subscriptions.jade compiled template
    templatizer["subscriptions"] = function tmpl_subscriptions() {
        return '<div class="subscriptionsView classes"><div class="subscriptionsContent"></div></div>';
    };

    // xmpp.jade compiled template
    templatizer["xmpp"] = function tmpl_xmpp() {
        return '<div class="bdsft-webrtc"><div class="xmpp fadeable classes topright"><div class="loginView"><div class="form-row"><label>Name</label><input type="text" name="name" placeholder="Email" class="name"/></div><div class="form-row"><label>Password</label><input type="password" name="password" class="password"/></div><div class="form-row"><button type="button" class="login button">Connect</button></div></div><div class="contentView"><div class="contactsHolder"></div><div class="chatsHolder"></div><div class="subscriptionsHolder"></div></div></div></div>';
    };

    return templatizer;
}));