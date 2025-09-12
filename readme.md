# blockchain simulation in ~~javascript~~ typescript

> ## about
>
> a blockchain implementation from the ground up built to mimic the core mechanics of the **bitcoin** blockchain

> ## status report
>
> implementation: <b style="color:orange"> in progress, functional</b>  
> documentation: <b style="color:orange"> todo</b>

> ## features implemented
>
> - block mining with proof of work
> - blockchain difficulty
> - wallets and balances
> - cross wallet transactions (single party)
> - utxo system
> - digital signatures with asymmetric encryption
> - blockchain validation (signatures, hashes, replaying tx history for utxo validation)
> - support for running as a terminal app (single node only)
> - ui in react for single/multi node setup
>   - each browser tab instance of the UI acts as a node in the network
> - gossip network communication through the BroadcastChannel API
>   - cross-node chain syncing mechanism
>   - block proposal and transaction proposal through gossip
>   - longest chain consensus rule
> - ...

> ## some intentional discrepancies for the sake of simplicity
>
> - wallet addresses are their public keys
> - transactions can not contain multiple wallet addresses as senders
> - mining includes all transactions in the mempool for the next block
> - gossip networks consist of all other nodes instead of just a subset
> - no headers-first syncing

<!-- > - gossip networks assume their nodes are synced when validating block and transaction proposals -->

> - ...

# todo

- implement utxo selection strategy for transactions (currently its in order, could be largest-first)
- merkle root in blocks
- migrate temporary styling and components to shadcn (?)
- miner rewards/gas fees ?
- support for explicit transaction selection during block mining ?
- try to break the system more -> rework error logging mechanism
- ...
