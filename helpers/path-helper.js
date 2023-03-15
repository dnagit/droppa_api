const moduleResult = {};
const imagePath = 'public/img';
moduleResult.directoryImage = Object.freeze({
    FACILITIES: 'facilities',
    PLACE: 'place',
    PLACETHUMB: 'place/thumb',
    PROPERTY: 'property',
    PROPERTYTHUMB: 'property/thumb',
    ZONE: 'zone',
    BLOG: 'blog',
    BLOGTHUMB: 'blog/thumb',
    USER: 'user',
    PLACE_TYPE: 'place-type',
    
});
moduleResult.shortPathImg = (filename, directoryType) => {
    let result = '';
    let filenameEncode = encodeURIComponent(filename);
    result = `${imagePath}/${directoryType}/${filenameEncode}`
    return result;
};
moduleResult.fullPathImg = (reqUrl , filename, directoryType) => {
    let result = '';
    let filenameEncode = encodeURIComponent(filename);
    result = `${reqUrl}/${imagePath}/${directoryType}/${filenameEncode}`
    return result;
};
export default moduleResult;