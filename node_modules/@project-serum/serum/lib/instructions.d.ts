export function encodeInstruction(instruction: any): Buffer;
export function decodeInstruction(message: any): any;
export const SETTLE_FUNDS_BASE_WALLET_INDEX: 5;
export const SETTLE_FUNDS_QUOTE_WALLET_INDEX: 6;
export const NEW_ORDER_OPEN_ORDERS_INDEX: 1;
export const NEW_ORDER_OWNER_INDEX: 4;
export const NEW_ORDER_V3_OPEN_ORDERS_INDEX: 1;
export const NEW_ORDER_V3_OWNER_INDEX: 7;
export const INSTRUCTION_LAYOUT: VersionedLayout;
export class DexInstructions {
    static initializeMarket({ market, requestQueue, eventQueue, bids, asks, baseVault, quoteVault, baseMint, quoteMint, baseLotSize, quoteLotSize, feeRateBps, vaultSignerNonce, quoteDustThreshold, programId, }: {
        market: any;
        requestQueue: any;
        eventQueue: any;
        bids: any;
        asks: any;
        baseVault: any;
        quoteVault: any;
        baseMint: any;
        quoteMint: any;
        baseLotSize: any;
        quoteLotSize: any;
        feeRateBps: any;
        vaultSignerNonce: any;
        quoteDustThreshold: any;
        programId: any;
    }): TransactionInstruction;
    static newOrder({ market, openOrders, payer, owner, requestQueue, baseVault, quoteVault, side, limitPrice, maxQuantity, orderType, clientId, programId, feeDiscountPubkey, }: {
        market: any;
        openOrders: any;
        payer: any;
        owner: any;
        requestQueue: any;
        baseVault: any;
        quoteVault: any;
        side: any;
        limitPrice: any;
        maxQuantity: any;
        orderType: any;
        clientId: any;
        programId: any;
        feeDiscountPubkey?: any;
    }): TransactionInstruction;
    static newOrderV3({ market, openOrders, payer, owner, requestQueue, eventQueue, bids, asks, baseVault, quoteVault, side, limitPrice, maxBaseQuantity, maxQuoteQuantity, orderType, clientId, programId, selfTradeBehavior, feeDiscountPubkey, }: {
        market: any;
        openOrders: any;
        payer: any;
        owner: any;
        requestQueue: any;
        eventQueue: any;
        bids: any;
        asks: any;
        baseVault: any;
        quoteVault: any;
        side: any;
        limitPrice: any;
        maxBaseQuantity: any;
        maxQuoteQuantity: any;
        orderType: any;
        clientId: any;
        programId: any;
        selfTradeBehavior: any;
        feeDiscountPubkey?: any;
    }): TransactionInstruction;
    static matchOrders({ market, requestQueue, eventQueue, bids, asks, baseVault, quoteVault, limit, programId, }: {
        market: any;
        requestQueue: any;
        eventQueue: any;
        bids: any;
        asks: any;
        baseVault: any;
        quoteVault: any;
        limit: any;
        programId: any;
    }): TransactionInstruction;
    static consumeEvents({ market, eventQueue, openOrdersAccounts, limit, programId, }: {
        market: any;
        eventQueue: any;
        openOrdersAccounts: any;
        limit: any;
        programId: any;
    }): TransactionInstruction;
    static cancelOrder({ market, openOrders, owner, requestQueue, side, orderId, openOrdersSlot, programId, }: {
        market: any;
        openOrders: any;
        owner: any;
        requestQueue: any;
        side: any;
        orderId: any;
        openOrdersSlot: any;
        programId: any;
    }): TransactionInstruction;
    static cancelOrderV2({ market, bids, asks, eventQueue, openOrders, owner, side, orderId, openOrdersSlot, programId, }: {
        market: any;
        bids: any;
        asks: any;
        eventQueue: any;
        openOrders: any;
        owner: any;
        side: any;
        orderId: any;
        openOrdersSlot: any;
        programId: any;
    }): TransactionInstruction;
    static cancelOrderByClientId({ market, openOrders, owner, requestQueue, clientId, programId, }: {
        market: any;
        openOrders: any;
        owner: any;
        requestQueue: any;
        clientId: any;
        programId: any;
    }): TransactionInstruction;
    static cancelOrderByClientIdV2({ market, openOrders, owner, bids, asks, eventQueue, clientId, programId, }: {
        market: any;
        openOrders: any;
        owner: any;
        bids: any;
        asks: any;
        eventQueue: any;
        clientId: any;
        programId: any;
    }): TransactionInstruction;
    static settleFunds({ market, openOrders, owner, baseVault, quoteVault, baseWallet, quoteWallet, vaultSigner, programId, referrerQuoteWallet, }: {
        market: any;
        openOrders: any;
        owner: any;
        baseVault: any;
        quoteVault: any;
        baseWallet: any;
        quoteWallet: any;
        vaultSigner: any;
        programId: any;
        referrerQuoteWallet?: any;
    }): TransactionInstruction;
}
import { VersionedLayout } from "./layout";
import { TransactionInstruction } from "@solana/web3.js";
//# sourceMappingURL=instructions.d.ts.map