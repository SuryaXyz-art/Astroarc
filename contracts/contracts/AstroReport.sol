// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AstroReport {
    struct Report {
        address user;
        string birthChartHash;
        string horoscopePrediction;
        string ipfsReportLink;
        uint256 timestamp;
    }

    mapping(address => Report[]) private userReports;
    uint256 public totalReports;

    event ReportCreated(address indexed user, string birthChartHash, uint256 timestamp);
    event ReportNFTMinted(address indexed user, uint256 reportId, string ipfsLink);

    function createReport(
        string memory _birthChartHash,
        string memory _horoscopePrediction,
        string memory _ipfsReportLink
    ) public {
        Report memory newReport = Report({
            user: msg.sender,
            birthChartHash: _birthChartHash,
            horoscopePrediction: _horoscopePrediction,
            ipfsReportLink: _ipfsReportLink,
            timestamp: block.timestamp
        });

        userReports[msg.sender].push(newReport);
        totalReports++;

        emit ReportCreated(msg.sender, _birthChartHash, block.timestamp);
    }

    function getUserReports(address _user) public view returns (Report[] memory) {
        return userReports[_user];
    }

    // Simplified minting representation. In a real scenario, this would import ERC721
    // and inherently mint a token using _mint(msg.sender, tokenId) 
    function mintReportNFT(uint256 reportIndex) public {
        require(reportIndex < userReports[msg.sender].length, "Report does not exist");
        Report memory report = userReports[msg.sender][reportIndex];
        
        // mock logic for hackathon
        emit ReportNFTMinted(msg.sender, reportIndex, report.ipfsReportLink);
    }
}
