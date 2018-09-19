# _smushr_

A command line tool to aggregate discrete data points across json files into a single readable result. It preserves 
structure of nested objects and arrays of indeterminant depth, allowing you to conveniently view all valid values for 
all keys at all levels. This would be useful for large sets of similar or repetitive .json files.

smushr searches a target directory and all subdirectories for .json files. It then combines all primitive data points
that are not already represented into a single array under the same key. If the value at a key is an object, it 
combines subsequent objects under the same key in the same way, preserving nested structure. If the value at a key is
an array, it checks each object against present objects for key parity, and treats objects with the same keys as the 
same object. Lastly, it writes the resultant object to a file `./smushed.json`, in the directory where the command was
executed. 

## Getting Started

- install with `npm install -g smushr`

## Usage

- open a terminal
- in terminal, navigate to location with .json files to be combined
- run `smush <dir>`, where `<dir>` is the relative path to the target folder, from the terminal's current directory

## Example 

###### ./A.json
```$xslt
{
    "name": "Henry",
    "height": 167,
    "props": {
        "tasks": 
            [
                { "name": "doStuff" },
                { "id": 1 }
            ],
        "roles": "admin"
    }
}
```

###### ./dir/B.json

```$xslt
{
    "name": "Max",
    "weight": 120,
    "props": {
        "tasks": 
            [
                { "name": "doDifferentStuff" },
                { "desc": "things need doing" }
            ],
        "roles": "user"
    }
}
```

###### ./smushed.json

```$xslt
{
    "name": ["Henry", "Max"],
    "height": [167],
    "weight": [120],
    "props": {
        "tasks": 
            [
                { "name": ["doStuff", "doDifferentStuff"] },
                { "id": [1] },
                { "desc": ["things need doing"] }
            ],
        "roles": ["admin", "user"]
    }
}
```