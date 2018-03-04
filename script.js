document.getElementById('notifyMe').addEventListener('click', function(){
    chrome.runtime.sendMessage({
        action:'notify'
    })
})