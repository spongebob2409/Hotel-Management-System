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
exports.IoTController = void 0;
const common_1 = require("@nestjs/common");
const iot_service_1 = require("./iot.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
let IoTController = class IoTController {
    iotService;
    constructor(iotService) {
        this.iotService = iotService;
    }
    getEvents(limit) {
        return this.iotService.getEvents(limit ? parseInt(limit) : 50);
    }
    getSensors() {
        return this.iotService.getSensors();
    }
    getParkingSessions() {
        return this.iotService.getParkingSessions();
    }
    handleEvent(payload) {
        return this.iotService.handleEvent(payload);
    }
    resolveEvent(id) {
        return this.iotService.resolveEvent(id);
    }
    seedSensors() {
        return this.iotService.seedSensors();
    }
};
exports.IoTController = IoTController;
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('sensors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "getSensors", null);
__decorate([
    (0, common_1.Get)('parking'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "getParkingSessions", null);
__decorate([
    (0, common_1.Post)('event'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "handleEvent", null);
__decorate([
    (0, common_1.Patch)('events/:id/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "resolveEvent", null);
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IoTController.prototype, "seedSensors", null);
exports.IoTController = IoTController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('iot'),
    __metadata("design:paramtypes", [iot_service_1.IoTService])
], IoTController);
//# sourceMappingURL=iot.controller.js.map