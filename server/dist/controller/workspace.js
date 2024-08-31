"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspace = exports.getAllWorkspaces = exports.deleteWorkspace = exports.createWorkspace = void 0;
const error_1 = require("utils/response/error");
const success_1 = require("utils/response/success");
const nanoid_1 = require("nanoid");
let db;
const createWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type, url, uid } = req.body;
    try {
        const userRef = yield db.collection("users").doc(uid);
        const workspaces = yield userRef.collection("workspaces").get();
        if (workspaces.size >= 3) {
            return res.status(400).json((0, error_1.ApiError)("You have reached the limit.", 400));
        }
        const id = (0, nanoid_1.nanoid)(6);
        const date = new Date().toISOString();
        const data = {
            id,
            name,
            type,
            url,
            createdAt: date,
            updatedAt: date,
        };
        yield userRef.collection("workspaces").doc(id).set(data);
        return res
            .status(201)
            .json((0, success_1.ApiSuccess)("Workspace created successfully", data));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json((0, error_1.ApiError)("Internal server error", 500, error));
    }
});
exports.createWorkspace = createWorkspace;
const deleteWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, id, uid } = req.body;
    try {
        const userRef = yield db
            .collection("users")
            .doc(uid)
            .collection("workspaces");
        const workspaces = yield userRef.get();
        if (workspaces.size <= 1) {
            return res
                .status(400)
                .json((0, error_1.ApiError)("You must have at least one workspace", 400));
        }
        yield userRef.doc(id).delete();
        return res
            .status(200)
            .json((0, success_1.ApiSuccess)("Workspace deleted successfully", {}));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json((0, error_1.ApiError)("Internal server error", 500, error));
    }
});
exports.deleteWorkspace = deleteWorkspace;
const getAllWorkspaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, uid } = req.body;
    try {
        const userRef = yield db.collection("users").doc(uid);
        const workspaces = yield userRef.collection("workspaces").get();
        const data = [];
        workspaces.forEach((doc) => {
            const { id, name } = doc.data();
            data.push({ id, name });
        });
        return res.status(200).json((0, success_1.ApiSuccess)("Workspaces fetched", data));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json((0, error_1.ApiError)("Internal server error", 500, error));
    }
});
exports.getAllWorkspaces = getAllWorkspaces;
const getWorkspace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, id } = req.body;
    try {
        const userRef = yield db.collection("users").doc(user.uid);
        const workspace = yield userRef.collection("workspaces").doc(id).get();
        if (!workspace.exists) {
            return res.status(404).json((0, error_1.ApiError)("Workspace not found", 404));
        }
        return res
            .status(200)
            .json((0, success_1.ApiSuccess)("Workspace fetched", workspace.data()));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json((0, error_1.ApiError)("Internal server error", 500, error));
    }
});
exports.getWorkspace = getWorkspace;
