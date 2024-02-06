# Funko Tech Assessment

## 1. SFCC XML Parser
I was able to complete the main objective and the bonus objective. The one lingering question and feature that I didn't add was whether a `<folder-link>` with the target `folder-id` should be delted. 

i.e. `fid` is `funko-blog-fandom` the target is `funko-blog-home` should the `<folder-link folder-id=funko-blog-home>` be removed if the `folder-id` in `<classification-link>` is being renamed to `funko-blog-home`?

## 2. Stream Products
I was told that this was the more difficult of the two and I found this to be the opposite. I was able to get the main object and the bonus objective working. However to get the tool working I had to create the `/output` directory. 

Additionally, regarding the `test-products-big.xml` file, there seems to be an issue with the File Stream library with large files. I keep getting this error below, I've verified that it occurs without my changes. I didn't spend too much time debugging but figured it should be called out. The output shows the correct results regardless.

```
Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed
    at node:internal/fs/streams:426:23
    at FSReqCallback.wrapper [as oncomplete] (node:fs:829:5) {
  code: 'ERR_STREAM_DESTROYED'
}
node:events:492
      throw er; // Unhandled 'error' event
      ^

Error [ERR_STREAM_DESTROYED]: Cannot call write after a stream was destroyed
    at node:internal/fs/streams:426:23
    at FSReqCallback.wrapper [as oncomplete] (node:fs:829:5)
Emitted 'error' event on WriteStream instance at:
    at emitErrorNT (node:internal/streams/destroy:151:8)
    at emitErrorCloseNT (node:internal/streams/destroy:116:3)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21) {
  code: 'ERR_STREAM_DESTROYED'
}
```