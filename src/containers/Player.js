import React from "react"
import Cards from "./Cards.js"
import "../css/Playercss.css"
export default class Player extends React.Component 
{
    renderAllCards = () => 
    {
        let counter = 0;
        let array = [];
        for (let i=0; i < this.props.cards.length; i++)
        {
            if (i === 1 && this.props.type === "dealer") {
                array.push(<Cards key = {counter} src = {this.props.src} flip = {this.props.flip} type = {this.props.type} text = "yes" card = {this.props.cards[i]}/>)
                counter = counter + 1;
            }
            else 
            {
                array.push(<Cards key = {counter} src = {this.props.src} flip = {this.props.flip} type = {this.props.type} text = "no" card = {this.props.cards[i]}/>)
                counter = counter + 1;
            }

        }
        return array;
    }
    render() 
    {
        return (
            <div className = "player">
                {this.renderAllCards()}
            </div>
        )
    }
}