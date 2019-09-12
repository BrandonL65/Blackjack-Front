import React from "react"
import Player from "./Player.js"
import Middle from "./Middle.js"
import "../css/Frontcss.css"
const tenValues = ["QUEEN", "KING", "JACK", "10"];

export default class Front extends React.Component 
{
    state = {
        name: '',
        chips: 1000,
        chipsID: 0,
        deckID: "",
        cardsRemaining: 0,
        playerCards: [],
        playerTotal: 0,
        dealerCards: [],
        dealerTotal: 0,
        displayDealerTotal: false,                 
        src: "",                        //source of 2nd card image
        flip: false,                     //if true, flip the 2nd dealer card
        winOrLose: "",
        gameOver: false,
        playerNumberOfAces: 0,
        dealerNumberOfAces: 0,
        betAmount: 50,
        doneDealing: false 
    }
    componentDidMount() 
    {
        fetch(`http://localhost:3000/profile`,
        {
            headers: 
            {
                Authorization: localStorage.token
            }
        })
        .then( resp => resp.json())
        .then( data => 
        {
            this.setState
            ({
                ...this.state,
                name: data.name,
                chips: data.chip.amount,
                chipsID: data.chip.id
            })
        })
    }
    newDeck = () => 
    {                                                                       //Fetches new deck and assigns to state 
        if (this.state.cardsRemaining < 110)                                    //if less than 100 cards left, shuffle
        {
            return fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=8`)               //6 decks 
            .then( resp => resp.json()) 
            .then( data => {     
                this.setState({
                    deckID: data["deck_id"],
                    cardsRemaining: data.remaining
                })
            })
        }
        else {
            return this.delay(100);
        }
    }
    drawCard = (who) => 
    {                      
        return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`)          
        .then( resp => resp.json())
        .then( data => {
            let assign = ""
            switch (who)
            {
                case "p":                                                           //player draws card
                    assign = this.handleValueAndDeck(data, "player")
                    this.setState({                 //Actual changes to state if player draws
                        ...this.state,
                        cardsRemaining: data.remaining,
                        playerCards: assign[1],
                        playerTotal: assign[0]
                    })
                    break;                                              
                case "d":                                                            //dealer draws card 
                    assign = this.handleValueAndDeck(data, "dealer")
                    this.setState({                     //If dealer draws, then assign card to dealer 
                        ...this.state,
                        cardsRemaining: data.remaining,
                        dealerCards: assign[1],
                        dealerTotal: assign[0]
                    })
                    if (this.state.dealerCards.length === 2)             //Copy card image of 2nd dealer card to state's src, to pass down to Card, because of cardback/actual image render
                    {
                        this.setState({
                            ...this.state,
                            src: this.state.dealerCards[1].image
                        })
                    }
                    break;
                default:
                    break;
            }
        })
    }
    newGame = () =>                          //Clears state, then calls a newDeck, and draws 2 Cards 
    {                  
        this.setState({
            ...this.state,
            playerCards: [],
            playerTotal: 0,
            dealerCards: [],
            dealerTotal: 0,
            displayDealerTotal: false,
            src: "",
            flip: false,
            winOrLose: "",
            gameOver: false,
            playerNumberOfAces: 0,
            dealerNumberOfAces: 0,
            doneDealing: false 
        }, () => {
            console.log(this.state)
            this.newDeck()                              //Draws 2 cards for player and 2 cards for dealer 
            .then(() => {
                return this.drawCard("p")
                .then(() => this.delay(600))
            })
            .then(() => {
                return this.drawCard("p")
                .then(() => this.delay(600))
            })
            .then(() => {
                return this.drawCard("d")
                .then(() => this.delay(600))
            })
            .then(() => {
                return this.drawCard("d")
                .then(() => this.delay(600))
            })
            .then(() => {
                if (this.handleInitialPlayerAce() === 1)                               //Returns true if both of initial player cards are aces 
                {
                    this.setState({                                                         
                        ...this.state,
                        playerTotal: 12,
                        playerNumberOfAces: this.state.playerNumberOfAces + 1,
                        doneDealing: true 
                    }, () => {
                        this.delay(300)
                        .then(() => this.doneDealing());
                    })
                }
                else if (this.handleInitialPlayerAce() === 2)                         //Returns false if only 1 of the player's initial cards is an ace 
                {   
                    this.setState({
                        ...this.state,
                        playerNumberOfAces: this.state.playerNumberOfAces + 1
                    }, () => {
                        this.delay(300);
                    })
                }      
                if (this.handleInitialDealerAce() === 1)                                    //if initial 2 cards are 21, dealer hits blackjack 
                {
                    this.delay(1400)
                    .then( () => {
                        this.handleFlip();
                        this.winOrLoseAlert("lose");
                    })
                }
                else if (this.handleInitialDealerAce() === 2) 
                {
                    this.setState({
                        ...this.state,
                        dealerTotal: 12,
                        dealerNumberOfAces: this.state.dealerNumberOfAces + 1
                    })
                }
                else if (this.handleInitialDealerAce() === 3) 
                {
                    this.setState({
                        ...this.state,
                        dealerNumberOfAces: this.state.dealerNumberOfAces + 1
                    })
                }
            })
        })
    }
    handleDoneDealing = () => {
        this.setState({
            ...this.state,
            doneDealing: true 
        })
    }
    handleInitialDealerAce = () => {
        if (this.state.dealerCards[0].value === "ACE" && tenValues.includes(this.state.dealerCards[1].value)) {                                      //if initial 2 cards are 21, dealer hits blackjack
            return 1;
        }
        else if (this.state.dealerCards[0].value === "ACE" && this.state.dealerCards[1].value === "ACE") {
            return 2;
        }
        else if (this.state.dealerCards[0].value === "ACE" || this.state.dealerCards[1].value === "ACE") {
            return 3;
        }
    }
    handleInitialPlayerAce = () => {                                                                             //Checks if first two cards contain an ace, used in newGame function 
        if (this.state.playerCards[0].value === "ACE" && this.state.playerCards[1].value === "ACE") {
            return 1;
        }
        else if (this.state.playerCards[0].value === "ACE" || this.state.playerCards[1].value === "ACE") {
            return 2;
        }
    }
    drawOne = () =>                           //Draw only 1 card
    {
        if (this.state.doneDealing === true)
        {
            this.drawCard("p")                 //Player draws a card 
            .then(() => {
                this.delay(300)
                if (this.state.gameOver !== true)
                {
                    this.handleAceValue();
                    if (this.state.playerTotal > 21 && this.state.playerNumberOfAces > 0)                   //If over 21 and player has 1 ace that can become a 1, make it a 1
                    {
                        this.setState({                                                                     //making it a 1
                            ...this.state,          
                            playerTotal: this.state.playerTotal-10,
                            playerNumberOfAces: this.state.playerNumberOfAces - 1
                        }, () => {
                            if (this.state.playerTotal > 21)                                                    //if after making it a 1, and playerTotal is still over 21, game over 
                            {
                                this.winOrLoseAlert("lose");
                            }
                        })
                    }
                    else if (this.state.playerTotal > 21 && this.state.playerNumberOfAces === 0)              //if player has no aces available, then lose game if over 21 
                    {
                        this.winOrLoseAlert("lose");
                    }
                }

            })
        }


    }
    handleAceValue = () => {                                                                    //Checks if last card drawn is an ace 
        if (this.state.playerCards.length > 2) {                                            //For every card drawn, see if last card is ace
            if (this.state.playerCards[this.state.playerCards.length-1].value === "ACE") {
                this.setState({
                    ...this.state,
                    playerNumberOfAces: this.state.playerNumberOfAces + 1                       //add 1 to # of player aces 
                }, () => {
                    this.delay(300);
                })
            }
        }
    }

    stand = () =>                           
    {
        // if (this.state.gameOver !== true)
        // {
        //     this.handleFlip()                                   //flip dealer 2nd card 
        //     this.delay(600)
        //     .then(() => {
                
        //         if (this.state.dealerTotal > 21)                                    //if dealer busts, you win
        //         {
        //             this.winOrLoseAlert("win", 30)
        //         }
        //         if (this.state.dealerTotal <= 21 && this.state.dealerTotal >= 17)           //Compares totals 
        //         {

        //             if (this.state.dealerTotal > this.state.playerTotal) {
        //                 this.delay(300)
        //                 .then(() => this.winOrLoseAlert("lose", 30))
        //             }
        //             else if (this.state.dealerTotal < this.state.playerTotal) {
        //                 this.delay(300)
        //                 .then(() => this.winOrLoseAlert("win", 30))
        //             }
        //             else if (this.state.dealerTotal === this.state.playerTotal) {
        //                 this.delay(300)
        //                 .then(() => this.winOrLoseAlert("push", 0))
        //             }
        //             else {
        //                 this.delay(1000)
        //                 .then(() => this.winOrLoseAlert("win", 30))
        //             }
        //         }
        //         if (this.state.dealerTotal < 17)                                    //keep drawing if less than 17
        //         {
        //                 this.drawCard("d")
        //                 .then(() => this.stand());
        //         }
        //     }) 
        // }
        this.delay(500)
        .then(() => {
            if (this.state.gameOver !== true) 
            {
                this.handleFlip();
                this.delay(1000)
                .then(() => {
                    this.setState({
                        ...this.state,
                        displayDealerTotal: true 
                    })
                    this.delay(500)
                    .then(() => {
                        if (this.state.dealerTotal === 17 && this.state.dealerNumberOfAces > 0) 
                        {
                            this.setState({
                                ...this.state,
                                dealerTotal: this.state.dealerTotal - 10,
                                dealerNumberOfAces: this.state.dealerNumberOfAces - 1
                            }, () => {
                                this.drawCard("d")
                                .then(() => {
                                    this.delay(600)
                                    .then(() => {this.stand()})
                                })
                            })
                        }
                        else if (this.state.dealerTotal === 17 && this.state.dealerNumberOfAces === 0) 
                        {
                            if (this.state.dealerTotal > this.state.playerTotal) 
                            {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("lose"))
                            }
                            else if (this.state.playerTotal > this.state.dealerTotal) 
                            {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("win"))
                            }
                            else if (this.state.playerTotal === this.state.dealerTotal) 
                            {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("push"))
                            }
                        }
                        else if (this.state.dealerTotal > 17 && this.state.dealerTotal <= 21)
                        {
                            if (this.state.dealerTotal > this.state.playerTotal) {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("lose"))
                            }
                            else if (this.state.dealerTotal < this.state.playerTotal) {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("win"))
                            }
                            else if (this.state.dealerTotal === this.state.playerTotal) {
                                this.delay(300)
                                .then(() => this.winOrLoseAlert("push"))
                            }
                            else {
                                this.delay(1000)
                                .then(() => this.winOrLoseAlert("win"))
                            }                    
                        }
                        else if (this.state.dealerTotal > 21 && this.state.dealerNumberOfAces > 0)
                        {
                            this.setState({
                                ...this.state,
                                dealerTotal: this.state.dealerTotal - 10,
                                dealerNumberOfAces: this.state.dealerNumberOfAces - 1
                            }, () => {
                                this.delay(500)
                                .then(() => this.stand())
                            })
                        }
                        else if (this.state.dealerTotal > 21 && this.state.dealerNumberOfAces === 0)
                        {
                            this.winOrLoseAlert("win");
                        }
                        else if (this.state.dealerTotal < 17) 
                        {
                            this.drawCard("d")
                            .then(() => {
                                this.delay(600)
                                .then(() => {
                                    if (this.state.dealerTotal > 21 && this.state.dealerCards[this.state.dealerCards.length-1].value === "ACE")
                                    {
                                        this.setState({
                                            ...this.state,
                                            dealerTotal: this.state.dealerTotal - 10
                                        }, () => {
                                            this.stand();
                                        })
                                    }
                                    else 
                                    {
                                        this.stand();
                                    }
                                });
                            })
                        }
                    })

                })
            }
        })                         
    }
    winOrLoseAlert = (what) => {                     //Different cases for different win/loss scenarios 
        switch (what)               
        {
            case "lose":
                this.setState({
                    ...this.state,
                    winOrLose: "Lose :(",
                    chips: this.state.chips - this.state.betAmount,
                    gameOver: true 
                }, () => this.updateChipDatabase())
                break
            case "win": 
                this.setState({
                    ...this.state,
                    winOrLose: "Win!!!",
                    chips: this.state.chips + this.state.betAmount,
                    gameOver: true 
                }, () => this.updateChipDatabase())
                break
            case "push":
                this.setState({
                    ...this.state,
                    winOrLose: "Push",
                    chips: this.state.chips,
                    gameOver: true 
                }, () => this.updateChipDatabase())
                break 
            default:
                break 
        }
    }
    updateChipDatabase = () => {
        fetch(`http://localhost:3000/chips/${this.state.chipsID}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: this.state.chips
            })
        })
        .then( resp => resp.json())
        .then( data => {
            console.log(`New Update: ${data.amount}`)
        })
    }
    handleValueAndDeck = (drawn, who) =>             //Called above. Assigns value to card and total cards  
    {                     
        let value = this.state[`${who}Total`]
        let currentCards = this.state[`${who}Cards`];
        for (let i=0; i < drawn.cards.length; i++) {
            value = value + this.assignValueToCard(drawn.cards[i])
            currentCards.push(drawn.cards[i])
        }
        return [value,currentCards]
    }

    assignValueToCard = (card) =>               //Fn to map card to actual int value 
    {                         
        if (card.value === "ACE") {
            return 11
        }
        else if (tenValues.includes(card.value)) {
            return 10 
        }
        else {
            return parseInt(card.value)
        }
    }
    handleFlip = () =>                                                      //flip dealer 2nd card 
    {
        this.setState({
            ...this.state,
            flip: true 
        })
    }
    delay = (t) =>                      //Delay for drawing card 
    {
        return new Promise(resolve => setTimeout(resolve,t));
    }
    render()
    {
        return (
            <div className = "board">
                <Player flip = {this.state.flip} src = {this.state.src} type = "dealer" cards = {this.state.dealerCards}/>
                <Middle betAmount = {this.state.betAmount} displayDealerTotal = {this.state.displayDealerTotal} dealerTotal = {this.state.dealerTotal} playerTotal = {this.state.playerTotal} chips = {this.state.chips} winOrLose = {this.state.winOrLose} newGame = {this.newGame} drawOne = {this.drawOne} stand = {this.stand} flip = {this.handleFlip}/>
                <Player flip = {this.state.flip} src = {this.state.src} type = "player" cards = {this.state.playerCards}/>
            </div>

        )
    }
}
