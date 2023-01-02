function executeFunction(id, func) {
    let btn = document.getElementById(id);
    btn.addEventListener("click", async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: func,
            world: "MAIN"
        });
    });    
}

executeFunction("copyName", copyJiraName);
executeFunction("copyBranchName", copyBranchName);
executeFunction("copyCommentName", copyCommentName);

async function copyJiraName() {
    await mdjePanel.copyJiraName();
}

async function copyBranchName() {
    await mdjePanel.copyBranchName();
}

async function copyCommentName() {
    await mdjePanel.copyCommentName();
}