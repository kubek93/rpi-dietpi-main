# Samba

## Problems

- Cannot connect to local samba server on mac os

```
sudo ifconfig lo0 127.0.0.2 alias up
```

- Problem with hide private folder for guests

```
// Add to global config

access based share enum = yes
```
