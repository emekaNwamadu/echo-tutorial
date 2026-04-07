import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"



export const getOne = query({
    
    args:{
       
        conversationId: v.id("conversations"), 
        contactSessionId: v.id("contactSessions"),
        

        
    },
    

    handler: async(ctx,args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid or expired contact session",
            })
        }
            
            
        
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found",
            });
            return null;
        }

        if (conversation.contactSessionId.toString() !== args.contactSessionId.toString()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Conversation does not belong to contact session",
            });
            return null;
        }
    
        return {_id: conversation._id, status: conversation.status, threadId: conversation.threadId};
    }

})

export const create = mutation({
    
    args:{
       
        organizationId: v.string(), 
        contactSessionId: v.id("contactSessions"),

        
    },
    

    handler: async(ctx,args) => {
        const session = await ctx.db.get(args.contactSessionId);
        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid or expired contact session",
            })
        }
            
            
        
        // TODO: Replace once functionality for thread creation is present 
        const threadId = "123";
        const conversationId = await ctx.db.insert("conversations", {
            contactSessionId: session._id,
            status: "unresolved",
            organizationId: args.organizationId,
            threadId,
        });
        
        return conversationId;    

    },

})


