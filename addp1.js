

let web3;
let contract;
const contractAddress = 'YOUR_CONTRACT_ADDRESS';  // Replace with your contract address
const contractABI = [
    {
        "constant": true,
        "inputs": [{"name": "candidateId", "type": "uint256"}],
        "name": "getVotes",
        "outputs": [{"name": "", "type": "uint256"}],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [{"name": "candidateId", "type": "uint256"}],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

window.addEventListener('load', function() {
    // Check if Web3 is injected (MetaMask)
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        window.ethereum.enable().catch(err => console.log(err));
        initializeContract();
    } else {
        alert("Please install MetaMask to interact with the blockchain.");
    }
});

function initializeContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
    document.getElementById("status").innerText = "Connected to Blockchain!";
}

// Function to start voting
async function vote(candidateId) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        await contract.methods.vote(candidateId).send({ from: account });
        document.getElementById("status").innerText = Vote for Candidate ${candidateId} successful!;
        getResults();  // Get updated results
    } catch (err) {
        document.getElementById("status").innerText = "Error in voting: " + err.message;
    }
}

// Function to fetch and display results
async function getResults() {
    try {
        // Get vote counts for each candidate
        const candidate1Votes = await contract.methods.getVotes(1).call();
        const candidate2Votes = await contract.methods.getVotes(2).call();
        const candidate3Votes = await contract.methods.getVotes(3).call();
        const candidate4Votes = await contract.methods.getVotes(4).call();

        // Update UI with the results
        document.getElementById("candidate1-votes").innerText = Candidate 1: ${candidate1Votes} votes;
        document.getElementById("candidate2-votes").innerText = Candidate 2: ${candidate2Votes} votes;
        document.getElementById("candidate3-votes").innerText = Candidate 3: ${candidate3Votes} votes;
        document.getElementById("candidate4-votes").innerText = Candidate 4: ${candidate4Votes} votes;

    } catch (err) {
        document.getElementById("status").innerText = "Error fetching results: " + err.message;
    }
}

// Function to scroll to vote section
function scrollToVote() {
    document.getElementById("vote").scrollIntoView({ behavior: 'smooth' });
}
