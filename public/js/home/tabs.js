// I'm lazy
function getElement(id){
    return document.getElementById(id);
}

document.querySelectorAll('.MAL-buttons').forEach((div) => {
    div.onclick = function(e){
        const title = e.srcElement.getAttribute("data-title");
        const textBox = div.nextElementSibling
        // const summary = div.nextElementSibling.innerHTML;
        // console.log(summary)

        switch(e.srcElement.classList[0].split("-")[1]){
            case "story":
                tabStory(textBox, summary)
                break;
            case "score":
                tabScore(textBox, title)
                break;
            case "airing":
                console.log("Airing")
                break;
        }
        // console.log(div.nextElementSibling)
    }
})

function tabStory(el, summary){
    el.innerHTML = "{{this.synopsis}}";
}

function tabScore(el, title){
    el.innerHTML = "SCORE"
}
