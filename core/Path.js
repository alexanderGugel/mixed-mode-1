
function PathUtils () {
}

PathUtils.prototype.hasTrailingSlash = function hasTrailingSlash (path) {
    return path[path.length - 1] === '/';
};

PathUtils.prototype.depth = function depth (path) {
    var count = 0;
    var length = path.length;
    var len = this.hasTrailingSlash(path) ? length - 1 : length;
    var i = 0;
    for (; i < len ; i++) count += path[i] === '/' ? 1 : 0;
    return count;
};

PathUtils.prototype.index = function index (path) {
    var length = path.length;
    var len = this.hasTrailingSlash(path) ? length - 1 : length;
    while (len--) if (path[len] === '/') break;
    return parseInt(path.substring(len + 1));
};

PathUtils.prototype.indexAtDepth = function indexAtDepth (path, depth) {
    if (!depth) {
        var index = path.indexOf('/');
        return index === -1 ? path : path.substring(0, index);
    }
    for (var i = 0, len = path.length ; i < len ; i++) {
        depth -= path[i] === '/' ? 1 : 0;
        if (!depth) {
            var result = '';
            while (path[++i] !== '/' && path[i]) result += path[i];
            return parseInt(result);
        }
    }
};

PathUtils.prototype.parent = function parent (path) {
    

module.exports = new PathUtils();
    
