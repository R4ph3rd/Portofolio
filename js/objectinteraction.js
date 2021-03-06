//fps & screen size
let fps;
let displayedparticules
//values for gravitation equation
let vitessemax = 4
let frictioncoef = 0.8 //coefficient of friction;
let particulesmax = 1000 //will change depending on screen size
let particules = [particulesmax]
let centralPoint
let G = 9; //constant of gravitation
let massPoint // will change depeing on screen size
//pour le portrait dans about
let largeur, hauteur, position
let xpos, ypos

//get data from html
let Page, heightPage
//what page are we reading ?
const el = location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
const workpage = "work.html"
const aboutpage = "about.html"
const homepage = "index.html"
const home = ""
const contactpage = "contact.php"
const mywork = "work"
let nameWorkPage = 20
let workInPage = false

//for home page typo event
var font, typoSize, index

//get scroll position
let scrollPos = 0
let val
addEventListener("load", function () {
    document.addEventListener("wheel", wheele, false);
});

//typo
let coordFixed = [], pnts = []

function windowResized() {
    //canvas on all page

    heightPage = Page.size().height + 200
    if (el == contactpage || el == aboutpage || el == homepage || el == home || el == workpage && windowWidth > 1000) heightPage = windowHeight

    finePage()
    resizeCanvas(windowWidth, heightPage)

    typoSize = (300 / 1600) * width

    //reinitialize paticles
    for (i = 0; i < displayedparticules; i++) {
        particules[i] = new Particle(random(0, width), //x
            random(0, height), //y
            random(2, 50), //mass
            random(1, 4), //size
            random(100, 150)); //seuil
    }

}

function wheele(e) {
    var delta = e.deltaY; //scroll variable
    //launch handle function if this happens
    handle(delta);
}


function finePage() {
    //are we in a work page ?
    for (let i = 1; i < nameWorkPage; i++) { //je ne compte pas afficher beaucoup de projets, donc ça suffira
        if (el.indexOf(i) != -1) { //sil'url contient un chiffre, ok ; seules les pages de projets en auront
            position = document.querySelector(".prezImg").getBoundingClientRect()
            largeur = position.width
            hauteur = position.height
            xpos = position.x
            ypos = position.y

            centralPoint = createVector(xpos + (largeur * 0.5), ypos + (hauteur * 0.5))
           // console.log("centralPoint" + centralPoint)
        }
    }

    //redefine position of the center of gravitation for fixed objects
    if (el == aboutpage) {
        position = document.querySelector(".taillezone").getBoundingClientRect()
        largeur = position.width
        hauteur = position.height
        xpos = position.x
        ypos = position.y

        centralPoint = createVector(xpos + (largeur * 0.5), ypos + (hauteur * 0.5))
    }

}

function setup() {
    Page = select('.bourin')
    heightPage = Page.size().height + 200
    console.log(el)
    if (el == homepage || el == home) heightPage = windowHeight
    else if (el == contactpage || el == aboutpage || el == homepage || el == home || el == workpage && windowWidth > 1000) heightPage = windowHeight
    

    // console.log("taille page = " + heightPage)
    canvas = createCanvas(windowWidth, heightPage);
    pixelDensity(1)
    background(30);
    typoSize = (300 / 1600) * width

    centralPoint = createVector(mouseX, mouseY)
    //create gravitation points centered on differents objects depeding on the current page
    if ((el == homepage) || (el == contactpage) || el == home) centralPoint = createVector(mouseX, mouseY)

    finePage()
    displayedparticules = particulesmax
    if(width < 1500) massPoint = width / 3
    else massPoint = 500

    //reset balls positions
    for (i = 0; i < displayedparticules; i++) {
        particules[i] = new Particle(random(0, width), //x
            random(0, height), //y
            random(2, 50), //mass
            random(1, 4), //size
            random(100, 150)); //seuil 
    }
    //charge typo only if we are on home page
    if (el == homepage || el == home) {
        opentype.load('fonts/FreeSansNoPunch.otf', function (err, f) {
            if (err) {
                print(err);
            } else {
                font = f;
                pnts = getPoints("Raphael Perraud");
                for (let i = 0; i < pnts.length; i++) {
                    coordFixed[i] = pnts[i]
                }
                loop();
            }
        })
    }
}

//reset data of typography
function handle(delta) {
    scrollPos = delta;
    if (el == homepage || el == home) {
        pnts = getPoints("Raphael Perraud");
        for (let i = 0; i < pnts.length; i++) {
            coordFixed[i] = pnts[i]
        }
    }
}

//loaded only on home page 
function getPoints(fontPath) {
    let centerPointY = (height / 2) + (2 * typoSize / 5)
    let centerPointX = (width - (typoSize * 4)) / 2 //calculate approximatively the margin to put 
    let name = "Raphaël   "
    fontPath = font.getPath(name, centerPointX, centerPointY, typoSize); //why do I have to enter two characters more that aren't displayed ?
    var path = new g.Path(fontPath.commands);
    path = g.resampleByLength(path, 2); //quantity of points
    textW = path.bounds().width;
    //let min = 1600
    //let max = 0
    // remove all commands without a coordinate
    for (let i = path.commands.length - 1; i >= 0; i--) {
        if (path.commands[i].x == undefined) {
            path.commands.splice(i, 1);
        }
    }
    return path.commands;
    //  console.log("min= " + min + "  max =" + max)
}

function draw() {
    noStroke();
    //background
    fill(30, 20);
    rect(0, 0, width, height);

    if ((el == homepage) || (el == contactpage) || el == home) centralPoint = createVector(mouseX, mouseY)

    fps = frameRate()
    //adapter le nombre de particules en fonction des fps & taille de l'écran
    displayedparticules = width / 1.6
    if (fps < 18) displayedparticules -= 100;
    if (fps < 25) displayedparticules -= 20;
    if ((fps > 40) && (displayedparticules < 1000)) displayedparticules += 10


    if (el == aboutpage) {
        centralPoint = createVector(xpos + (largeur * 0.5), ypos + (hauteur * 0.5))
        if (displayedparticules > (width / 1.6) * 0.6) displayedparticules = (width / 1.6) * 0.6
    }

    //particles

    //verify : are we ovrpass the limit of scroll ?
    if ((scrollPos > 2 && el == homepage)) {
        overPassed = 1
        //set new positions of points (typography) if we want to draw the text
        G = 0.03125 * width // change attraction, yes, but proportionnaly to screen size to avoid some particles in this new attraction
        if (pnts.length > 0) {
            // let the points dance
            for (let i = 0; i < pnts.length; i++) {
                pnts[i].x += random(-1, 1) * 1
                constrain(pnts[i].x, coordFixed[i].x - 1, coordFixed[i].x + 1)
                pnts[i].y += random(-1, 1) * 1
                constrain(pnts[i].y, coordFixed[i].y - 1, coordFixed[i].y + 1)
            }
        }
        //then update particules
        //use the loop to draw a form between particles
        push()
        noFill()
        stroke(23, 175, 135)
        strokeWeight(2)
        beginShape()
        for (let i = 0; i < displayedparticules; i++) {
            index = int(map(i, 0, 1000, 0, pnts.length)) //faire correspondre une particule à un point de typo
            particules[i].update(index, G)
            particules[i].display();
            push()
            vertex(pnts[index].x, pnts[index].y)
            pop()
        }
        endShape()
        pop()
    } else {
        //reset G value & pnts value
        G = 15
        pnts = []
        //just update particles

        for (let p = 0; p < displayedparticules; p++) {
            index = -1

            particules[p].update(index, G)
            particules[p].display();
        }
    } //else
} //draw
