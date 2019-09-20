import React from "react"
import Cardback from "../images/cardback.png"
import "../css/Imgcss.css"
export default class Cards extends React.Component
{

    hiddenOrShowCard = () => {
        if (this.props.flip !== true && this.props.text === "yes") {
            return <img className = "img" onClick = {this.showImage} style = {{height: "150px"}} src = {Cardback} alt = "Card" />
        }
        else if (this.props.text === "no") {
            return <img className = "img" onClick = {this.showImage} style = {{height: "150px"}} src = {this.props.card.image} alt = "Card" />
        }
        else {
            return <img className = "img" onClick = {this.showImage} style = {{height: "150px"}} src = {this.props.src} alt = "Card" />
        }
    }

    render()
    {
        return (
                <div style = {{display: "inline"}}>
                    {this.hiddenOrShowCard()}
                </div>
        )
    }
}
