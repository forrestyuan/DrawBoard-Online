export interface IVCache {
  from: string;
  node: HTMLVideoElement;
  videoChuncks: BlobPart[];
  createBlob: (
    blobParts?: BlobPart[] | undefined,
    options?: BlobPropertyBag | undefined
  ) => Blob;
}
class VideoStore {
  videoCache: Array<IVCache> = [];
  
  isExistUser(username: string) {
    return !this.videoCache.find((item) => item.from === username);
  }

  addUserCache(cache:IVCache){
    this.videoCache.push(cache)
  }
}
let videoStore = new VideoStore();
export { videoStore };
export default videoStore;
