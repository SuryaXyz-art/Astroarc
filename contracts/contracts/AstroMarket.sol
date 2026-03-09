// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AstroMarket {
    struct Astrologer {
        address wallet;
        string name;
        uint256 price; // in wei
        uint256 ratingCount;
        uint256 totalRating;
        bool isActive;
    }

    struct Session {
        address user;
        address astrologer;
        uint256 timestamp;
        bool isCompleted;
    }

    mapping(address => Astrologer) public astrologers;
    address[] public astrologerAddresses;
    Session[] public sessions;

    event AstrologerRegistered(address indexed astrologer, string name, uint256 price);
    event SessionBooked(address indexed user, address indexed astrologer, uint256 sessionId);
    event ReviewSubmitted(address indexed user, address indexed astrologer, uint8 rating);

    function registerAstrologer(string memory _name, uint256 _priceInWei) public {
        require(!astrologers[msg.sender].isActive, "Already registered");
        
        astrologers[msg.sender] = Astrologer({
            wallet: msg.sender,
            name: _name,
            price: _priceInWei,
            ratingCount: 0,
            totalRating: 0,
            isActive: true
        });
        astrologerAddresses.push(msg.sender);
        
        emit AstrologerRegistered(msg.sender, _name, _priceInWei);
    }

    function bookSession(address _astrologer) public payable {
        Astrologer memory ast = astrologers[_astrologer];
        require(ast.isActive, "Astrologer not active");
        require(msg.value >= ast.price, "Insufficient payment");

        // Transfer funds to astrologer (simple Native token transfer)
        payable(_astrologer).transfer(msg.value);

        sessions.push(Session({
            user: msg.sender,
            astrologer: _astrologer,
            timestamp: block.timestamp,
            isCompleted: false
        }));

        emit SessionBooked(msg.sender, _astrologer, sessions.length - 1);
    }

    // Rate 1-5
    function submitReview(address _astrologer, uint8 _rating) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        // Simple trust-based rating for hackathon
        Astrologer storage ast = astrologers[_astrologer];
        ast.ratingCount++;
        ast.totalRating += _rating;
        emit ReviewSubmitted(msg.sender, _astrologer, _rating);
    }

    function getAllAstrologers() public view returns (Astrologer[] memory) {
        Astrologer[] memory list = new Astrologer[](astrologerAddresses.length);
        for (uint256 i = 0; i < astrologerAddresses.length; i++) {
            list[i] = astrologers[astrologerAddresses[i]];
        }
        return list;
    }
}
