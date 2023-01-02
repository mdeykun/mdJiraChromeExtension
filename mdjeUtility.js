let mdjePanel = {
    href: null,

    start: async function() {
        await this.showPanel();
    },

    showPanel: async function() {
        while (true) {
            try {
                if(this.href == document.location.href) {
                   continue; 
                }

                this.href = document.location.href;

                var regex = new RegExp(/^(?:.*atlassian.net\/)(?:browse.*|jira.*selectedIssue=.*)$/, 'g');
                if (regex.test(this.href) !== true) {
                    this.toolsPanel.setVisibile(false);
                    continue;
                }

                let html = '';
                html += await this.createMenuItem('copyCommentName', 'Copy comment name', 'fas fa-copy');
                html += await this.createMenuItem('copyBranchName', 'Copy branch name', 'fas fa-code-branch');
                html += await this.createMenuItem('copyName', 'Copy name', 'fas fa-clone');
                html += ` | <a id="recordinfo:close" style="margin-left:15px;cursor:pointer;color:rgb(51,51,51)" href="javascript:void(0)"><i class="fas fa-xmark"></i></a>`;

                this.toolsPanel.setHtml(html.trim());
                this.toolsPanel.setVisibile(true);

                this.attachEvent("copyCommentName", true, async () => {
                    await this.copyCommentName();
                });

                this.attachEvent("copyBranchName", true, async () => {
                    await this.copyBranchName();
                });

                this.attachEvent("copyName", true, async () => {
                    await this.copyJiraName();
                });

                this.attachEvent("close", false, async () => {
                    this.toolsPanel.setVisibile(false);
                });   
            }
            catch(e) {
                this.toolsPanel.setVisibile(false);
                console.error(e);
            }
            finally {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    },

    attachEvent: async function(id, anymate, eventHandler) {
        let element = document.querySelector(`#mdje\\:${id}`);
        if (element) {
            let icon = element.innerHTML;

            element.addEventListener('click', async () => {
                if(eventHandler.constructor.name === 'AsyncFunction') {
                    await eventHandler();
                }
                else {
                    eventHandler();
                }
                if(anymate) {
                    element.innerHTML = `<i style="color:green" class="fa-solid fa-circle-check"></i>`;
                    setTimeout(()=>{
                        element.innerHTML = icon;
                    }, 500);
                }
            });
        }
    },

    createMenuItem: async function(id, title, icon) {
        let style = `color:#0052CC;cursor:pointer;margin-right:15px`;
        return ` <a id='mdje:${id}' title='${title}' style='${style}' href='javascript:void(0)'><i class='${icon}'></i></a>`;
    },

    getItemDetails: function() {
        let titlesNodes = document.querySelectorAll("[data-test-id='issue.views.issue-base.foundation.summary.heading']");
        let titlesNode = titlesNodes.item(0);
        let title = titlesNode?.innerText || titlesNode?.textContent;
    
        let urlSearchParams = new URLSearchParams(window.location.search);
        let number = urlSearchParams.get('selectedIssue');
    
        if(number == null || number == '') {
            let numberNodes = document.querySelectorAll("[data-test-id='issue.views.issue-base.foundation.breadcrumbs.breadcrumb-current-issue-container']");
            let numberNode = numberNodes.item(0);
            number = numberNode?.innerText || numberNode?.textContent;
        }
    
        return { number, title };
    },
    
    copyName: async function(formatter) {
        let { number, title } = this.getItemDetails();
    
        if(number == null || number == '') {
            alert("Can't extract ticket number");
            return;
        }
    
        let itemName = formatter(number, title);
        await navigator.clipboard.writeText(itemName);
    },

    copyJiraName: async function() {
        await this.copyName(function(number, title) {
            return `${number} - ${title}`;
        });
    },
    
    copyBranchName: async function() {
        await this.copyName(function(number, title) {
            let itemName = `${number} ${title}`;
            itemName = itemName.trim();
            itemName = itemName.replace(/[.,'"/]/g, "");
            itemName = itemName.replace(/[ ]/g, "_");
            return itemName;
        });
    },
    
    copyCommentName: async function() {
        await this.copyName(function(number, title) {
            return `${number}. ${title}`;
        });
    },

    toolsPanel: {
        div: null,

        getDiv: function() {
            if (this.div == null) {
                let div = document.createElement('div');
                div.setAttribute("id", "mdjePanel");
                div.style.background = "#FFF";
                div.style.lineHeight = "40px";
                div.style.padding = "0 20px";
                div.style.color = "rgb(51,51,51)";
                div.style.display = 'none';
                div.style.position = "fixed";
                div.style.top = "8px";
                div.style.zIndex = "100500";
                div.style.right = "390px";
                document.body.appendChild(div);

                this.div = div;
            }
    
            return this.div;
        },
    
        setVisibile: function(isVisible) {
            if(this.div == null && isVisible !== true) {
                return;
            }

            let div = this.getDiv();
            if(div) {
                div.style.display = isVisible !== true ? 'none' : '';
            }
        },
    
        setHtml: function(html) {
            let div = this.getDiv();
            if(div) {
                div.innerHTML = html;
            }
        }
    },
};

mdjePanel.start();