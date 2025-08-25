# Blockchain simulation in javascript

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
> - utxo system
> - digital signatures with asymmetric encryption
> - blockchain validation
> - ...

> ## intentional discrepancies for the sake of simplicity
>
> - wallet addresses are their public keys
> - transactions can not contain multiple senders/recipients
> - mining includes all pending transactions in the next block
> - transactions don't have locking scripts
> - ...

# todo

- ui built (react?)
- support for multinode blockchains
- consensus rules
- miner rewards/gas fees ?
- support for explicit transaction selection ?
- try to break the system more
- ...
