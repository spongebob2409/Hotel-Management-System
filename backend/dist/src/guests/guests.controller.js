"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsController = void 0;
const common_1 = require("@nestjs/common");
const guests_service_1 = require("./guests.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let GuestsController = class GuestsController {
    guestsService;
    constructor(guestsService) {
        this.guestsService = guestsService;
    }
    findAll(search) {
        return this.guestsService.findAll(search);
    }
    findOne(id) {
        return this.guestsService.findOne(id);
    }
    updateVip(id, vipStatus) {
        return this.guestsService.updateVip(id, vipStatus);
    }
};
exports.GuestsController = GuestsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/vip'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('vipStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", void 0)
], GuestsController.prototype, "updateVip", null);
exports.GuestsController = GuestsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('guests'),
    __metadata("design:paramtypes", [guests_service_1.GuestsService])
], GuestsController);
//# sourceMappingURL=guests.controller.js.map