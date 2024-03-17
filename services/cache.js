const Redis = require('ioredis');

class CacheService {
    constructor() {
        this.redis = new Redis();
    }

    // Agent Information Caching
    async addAgentInfo(agentId, info) {
        await this.redis.set(`agent:${agentId}`, JSON.stringify(info));
    }

    async getAgentInfo(agentId) {
        const data = await this.redis.get(`agent:${agentId}`);
        return JSON.parse(data);
    }

    async refreshAgentToken(agentId, token) {
        const agentInfo = await this.getAgentInfo(agentId);
        agentInfo.token = token;
        await this.addAgentInfo(agentId, agentInfo);
    }

    // Call Information Caching
    async addCallInfo(callId, info) {
        await this.redis.set(`call_info:${callId}`, JSON.stringify(info));
    }

    async getCallInfo(callId) {
        const data = await this.redis.get(`call:${callId}`);
        return JSON.parse(data);
    }

    async removeCallInfo(callId) {
        await this.redis.del(`call:${callId}`);
    }

    // Company and Group Information Caching
    async getCompany(companyId) {
        const data = await this.redis.get(`company:${companyId}`);
        return JSON.parse(data);
    }

    async getGroupInfo(groupId) {
        const data = await this.redis.get(`group:${groupId}`);
        return JSON.parse(data);
    }

    async initCompany(companyId, info) {
        await this.redis.set(`company:${companyId}`, JSON.stringify(info));
    }

    // Route Gateway Retrieval
    async getRouteGateway(companyId, calledNumber) {
        // Implement logic to retrieve route gateway
    }

    // VDN Phone Retrieval
    async getVdnPhone(phoneNumber) {
        // Implement logic to retrieve VDN phone information
    }

    // Playback Retrieval
    async getPlayback(id) {
        // Implement logic to retrieve playback information
    }

    // Cache Initialization and Shutdown
    async stop() {
        await this.redis.quit();
    }
}

module.exports = CacheService;