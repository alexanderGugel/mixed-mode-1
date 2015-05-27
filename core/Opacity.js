/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

var pathUtils = require('./Path');

/**
 * The transform class is responsible for calculating the transform of a particular
 * node from the data on the node and its parent
 *
 * @constructor Opacity
 */
function Opacity () {
    this.local = Opacity.IDENT;
    this.global = Opacity.IDENT;
    this.needsUpdate = false;
    this.parent = null;
    this.breakPoint = false;
}

Opacity.IDENT = 1;

Opacity.prototype.reset = function reset () {
    this.needsUpdate = false;
    this.parent = null;
    this.breakPoint = false;
};

Opacity.prototype.setParent = function setParent (parent) {
    this.parent = parent;
};

Opacity.prototype.getParent = function getParent () {
    return this.parent;
};

Opacity.prototype.setDirty = function setDirty () {
    this.needsUpdate = true;
};

Opacity.prototype.isDirty = function isDirty () {
    return this.needsUpdate;
};

Opacity.prototype.setBreakPoint = function setBreakPoint () {
    this.breakPoint = true;
};

Opacity.prototype.isBreakPoint = function isBreakPoint () {
    return this.breakPoint;
};

Opacity.prototype.getLocal = function getLocal () {
    return this.local;
};

Opacity.prototype.getWorld = function getWorld () {
    if (!this.isBreakPoint())
        throw new Error('This transform is not calculating world transforms');
    return this.global;
};

Opacity.prototype.from = function from (node) {
    if (!this.parent || this.parent.isBreakPoint())
        return this.fromNode(node);
    else return this.fromNodeWithParent(node);
};

Opacity.prototype.calculateWorld = function calculateWorld () {
    var nearestBreakPoint = this.parent;

    while (nearestBreakPoint && !nearestBreakPoint.isBreakPoint())
        nearestBreakPoint = nearestBreakPoint.parent;

    if (nearestBreakPoint) {
        var newGlobal = nearestBreakPoint.getWorld() * this.local;
        var changed = newGlobal !== this.global;
        this.global = newGlobal;
        return changed;
    }
    else {
        this.global = this.local;
        return false;
    }
};


/**
 * Creates a transformation matrix from a Node's spec.
 *
 * @method fromSpec
 *
 * @param {Node.Spec} spec of the node
 * @param {Array} size of the node
 * @param {Array} size of the node's parent
 * @param {Array} target array to write the matrix to
 *
 * @return {Boolean} whether or not the target array was changed
 */
Opacity.prototype.fromNode = function fromNode (node) {
    var previous = this.local;

    this.local = node.value.showState.opacity;

    var changed = this.local !== previous;

    if (this.isBreakPoint()) {
        changed = this.calculateWorld();
    }

    return true;

    return changed;
};

/**
 * Uses the parent transform, the node's spec, the node's size, and the parent's size
 * to calculate a final transform for the node. Returns true if the transform has changed.
 *
 *
 * @return {Boolean} whether or not the transform changed
 */
Opacity.prototype.fromNodeWithParent = function fromNodeWithParent (node) {
    var previous = this.local;
    var parent = this.parent.local;

    this.local = parent * node.value.showState.opacity;

    var changed = this.local !== previous;

    if (this.isBreakPoint()) changed = this.calculateWorld();

    return true;

    return changed;
};

module.exports = Opacity;
