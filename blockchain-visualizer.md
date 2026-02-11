Overview
Build a web application that visualizes how blockchain works. Users should be able to see blocks, mine new blocks, and watch validation happen in real-time.

What You'll Build
A blockchain visualizer that demonstrates:

How blocks link together through hashes
How mining works (proof-of-work)
How tampering breaks the chain
How validation detects problems

Core Requirements
1. Display the Blockchain
Show each block as a card with:

Block number (0, 1, 2, 3...)
Timestamp (when block was created)
Data (e.g., "Alice pays Bob 10")
Previous hash (first 10 characters + ...)
Nonce (the number found during mining)
Hash (first 10 characters + ...)
Visual linking: Show how each block's "Previous Hash" matches the previous block's "Hash" (use color coding or arrows).

2. Mining Feature
Input field: Text input for block data

Mine button: Clicking starts the mining process

Mining process:

Show "Mining..." or a spinner
Find a nonce that makes the hash start with the required number of zeros
Display mining time (e.g., "Mined in 45ms")
Add the new block to the chain

3. Validation Indicator
Display: Large, clear indicator showing:

"Chain Valid" (green) when blockchain is valid
"Chain Invalid" (red) when blockchain is broken
Updates automatically whenever:

A new block is added
A block is edited

4. Difficulty Selector
Dropdown or buttons: Choose difficulty 1, 2, 3, or 4

Difficulty = number of leading zeros required in hash
Example: Difficulty 3 = hash must start with "000"
Bonus Features (Optional)
Tampering Demo
Add an "Edit" button on each block
Let users change the data without re-mining
Show the chain becoming invalid (red border on tampered block)
Auto-Mine Feature
Button to automatically mine multiple blocks at once
Shows mining progress for each block
Transaction Ledger View
Simple list of all block data in order
Example: "Block 1: Alice pays Bob 10"
Technical Requirements
Frontend Stack (Choose One)
Vanilla: HTML + CSS + JavaScript
Framework: React, Vue, or Svelte
Build tool: Vite, Create React App, or plain files
Blockchain Logic
Reuse the concepts from class:

SHA-256 hashing (use crypto-js library for browser)
Block class (with calculateHash, mine methods)
Blockchain class (with isValid method)
Mining = find nonce where hash starts with N zeros
No Backend Required
Implement everything in the browser using JavaScript's crypto libraries.

Recommended library: crypto-js for SHA-256 in the browser

npm install crypto-js
Submission Requirements

1. GitHub Repository
Create a repo named: blockchain-visualizer or blockchain-demo

Include:

Source code with clear folder structure
README.mdLinks to an external site. with:
Project title and description
How to run locally (npm install + npm run dev or "open index.html")
Screenshot or GIF of your app in action
(Optional) Link to live demo
Clean, commented code
2. Make it Public
Ensure your repo is public so we can review it.

3. What to Submit
Required:

GitHub repository link
Optional but recommended:

Live demo URL (GitHub Pages, Vercel, Netlify)
