// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AstroPrediction {
    struct Market {
        uint256 id;
        string question;
        string aiPredictionSignal;
        uint256 totalYesPool;
        uint256 totalNoPool;
        bool isResolved;
        bool resultOutcome; // true for yes, false for no
    }

    uint256 public nextMarketId;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint256)) public yesBets;
    mapping(uint256 => mapping(address => uint256)) public noBets;

    event MarketCreated(uint256 id, string question, string aiSignal);
    event BetPlaced(uint256 marketId, address user, bool betYes, uint256 amount);
    event MarketResolved(uint256 marketId, bool outcome);

    function createMarket(string memory _question, string memory _aiPredictionSignal) public {
        markets[nextMarketId] = Market({
            id: nextMarketId,
            question: _question,
            aiPredictionSignal: _aiPredictionSignal,
            totalYesPool: 0,
            totalNoPool: 0,
            isResolved: false,
            resultOutcome: false
        });
        emit MarketCreated(nextMarketId, _question, _aiPredictionSignal);
        nextMarketId++;
    }

    function placeBet(uint256 _marketId, bool _betYes) public payable {
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market resolved");
        require(msg.value > 0, "Bet must be > 0");

        if (_betYes) {
            yesBets[_marketId][msg.sender] += msg.value;
            market.totalYesPool += msg.value;
        } else {
            noBets[_marketId][msg.sender] += msg.value;
            market.totalNoPool += msg.value;
        }

        emit BetPlaced(_marketId, msg.sender, _betYes, msg.value);
    }

    // Owner only in a real contract
    function resolveMarket(uint256 _marketId, bool _outcome) public {
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Already resolved");
        market.isResolved = true;
        market.resultOutcome = _outcome;
        emit MarketResolved(_marketId, _outcome);
    }

    function claimWinnings(uint256 _marketId) public {
        Market storage market = markets[_marketId];
        require(market.isResolved, "Market not resolved");

        uint256 userBet = 0;
        uint256 winningPool = 0;
        uint256 totalPool = market.totalYesPool + market.totalNoPool;

        if (market.resultOutcome) {
            userBet = yesBets[_marketId][msg.sender];
            winningPool = market.totalYesPool;
            yesBets[_marketId][msg.sender] = 0; // prevent re-entrancy
        } else {
            userBet = noBets[_marketId][msg.sender];
            winningPool = market.totalNoPool;
            noBets[_marketId][msg.sender] = 0; // prevent re-entrancy
        }

        require(userBet > 0, "No winnings");

        uint256 payout = (userBet * totalPool) / winningPool;
        payable(msg.sender).transfer(payout);
    }
}
