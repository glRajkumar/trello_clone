export const Catageries = [
    "Personal",
    "Education",
    "Retail",
    "Finance",
    "Sport",
    "Information tecnology",
    "Cloud",
    "Blog",
    "Comedy",
    "Local",
    "Textile",
    "Network",
    "Movie",
    "Start-up",
    "Vehicle",
    "History",
    "Others"
]

export const bgs = [
    {
        isColour: true,
        name: "rgb(255,255,255)"
    },
    {
        isColour: true,
        name: "rgb(82 , 157, 52)"
    },
    {
        isColour: true,
        name: "rgb(0 , 121, 191)"
    },
    {
        isColour: true,
        name: "rgb(210, 144, 52)"
    },
    {
        isColour: true,
        name: "rgb(176, 70, 50)"
    },
    {
        isColour: true,
        name: "rgb(205, 90, 145)"
    },
    {
        isColour: true,
        name: "rgb(137, 96, 157)"
    },
    {
        isColour: true,
        name: "rgb(0, 172, 204)"
    },
    {
        isColour: true,
        name: "rgb(81, 12, 5)"
    },
    {
        isColour: true,
        name: "rgb(1, 152, 57)"
    },
    {
        isColour: true,
        name: "rgb(9, 24, 76)"
    },
    {
        isColour: false,
        name: "1.jpg"
    },
    {
        isColour: false,
        name: "2.jpg"
    },
    {
        isColour: false,
        name: "3.jpg"
    },
    {
        isColour: false,
        name: "4.jpeg"
    }
]

export const initDnDState = {
    dragFrom: null,
    dragTo: null
}

export const colDragStyle = {
    overflowX: "scroll",
    minHeight: "80vh",
    display: "grid",
    gridTemplateColumns: "repeat(100, minmax(250px, 1fr))"
}

export const getBg = (bg) => {
    if (!bg) return
    let background = {}
    if (bg.isColour) {
        background.backgroundColor = bg.name
        if (bg.name === "rgb(255,255,255)") {
            background.border = "1px solid rgba(0,0,0,.2)"
        }
        return background
    } else {
        background.backgroundImage = `url('/static/${bg.name}')`
        return background
    }
}
