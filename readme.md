# blockchain simulation in javascript

> ## about
>
> a blockchain implementation from the ground up built to mimic the core mechanics of the **bitcoin** blockchain

> ## status report
>
> implementation: <b style="color:orange"> in progress</b>  
> documentation: <b style="color:orange"> in progress</b>

> ## features implemented
>
> - block mining with proof of work
> - blockchain difficulty
> - wallets and balances
> - cross wallet transactions (single party)
> - utxo system, balance calculation
> - digital signatures with asymmetric encryption
> - blockchain validation (signatures, hashes, replaying tx history for utxos)
> - support for running as a terminal app (single node only)
> - ui in react for single/multi node setup (in progress)
> - ...

> ## intentional discrepancies for the sake of simplicity
>
> - wallet addresses are their public keys
> - transactions can not contain multiple wallet addresses as senders/recipients
> - mining includes all pending transactions in the next block
> - transactions don't have locking scripts
> - gossip networks consist of all other nodes instead of just a subset
> - no headers-first syncing
> - ...

# todo

- merkle root in blocks
- migrate temporary styling and components to shadcn (?)
- consensus rules
- support for multinode blockchains
- miner rewards/gas fees ?
- support for explicit transaction selection ?
- try to break the system more
- ...
