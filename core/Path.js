
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
    var i = 0;
    var len = path.length;
    for (; i < len ; i++) {
        depth -= path[i] === '/' ? 1 : 0;
        if (!depth) {
            var index = path.indexOf(i, '/');
            var result = index === -1 ? path.substring(i) : path.substring(i, index);
            var num = parseInt(result);
            return isNaN(num) ? result : num;
        }
    }
};

PathUtils.prototype.parent = function parent (path) {
    return path.substring(0, path.lastIndexOf('/', path.length - 2));
};

PathUtils.prototype.isChildOf = function isChildOf(child, parent) {
    child = this.hasTrailingSlash(child) ? child : child + '/';
    parent = this.hasTrailingSlash(parent) ? parent : parent + '/';
    return child.indexOf(parent) !== -1;
};

PathUtils.prototype.getSelector = function getSelector(path) {
    var index = path.indexOf('/');
    return index === -1 ? path : path.substring(0, index);
};

module.exports = new PathUtils();

