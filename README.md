# Stonk-balatro

## Naming

You will probably see other names throughout the project... they are all equally correct and incorrect.

## Tech

### Language and Environment

Currently running electron + vite + typescript.

Typescript is very strict! Takes some time to get used to.

### Architecture

Renderer-main-child

## Troubleshooting

### Error `RangeError: Maximum call stack size exceeded`

If you encounter this error, along with this following callstack:

```
at hasBinary (some-path\is-binary.js:49:63)
at hasBinary (some-path\is-binary.js:49:63)
at hasBinary (some-path\is-binary.js:49:63)
at hasBinary (some-path\is-binary.js:49:63)
at hasBinary (some-path\is-binary.js:49:63)
at hasBinary (some-path\is-binary.js:49:63)
```

it means somewhere in the code you're using a circularly-referenced object.
Keep in mind that javascript objects are pass-by-reference, so something like

```
object = someArray[1];

newObject = object;
newObject.a = 1;
newObject.b = 2;

someArray[1] = newObject; <-- this will cause a loop reference!
```

By doing so, the JSON parser will crash and burn as it attempts to serialize the object but is trapped.

The only correct way of making sure things won't fall into loops is to create a fresh new object and assign.
