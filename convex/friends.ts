import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("No tine autorización");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("Usuario no encontrado");
    }

    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    const friendships = [...friendships1, ...friendships2];

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await ctx.db.get(
          friendship.user1 === currentUser._id
            ? friendship.user2
            : friendship.user1
        );

        if (!friend) {
          throw new ConvexError("No se encontro el amigo");
        }

        return friend;
      })
    );
  },
});

// export const createGroup = mutation({
//   args: {
//     members: v.array(v.id("users")),
//     name: v.string(),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();

//     if (!identity) {
//       throw new Error("No tine autorización");
//     }

//     const currentUser = await getUserByClerkId({
//       ctx,
//       clerkId: identity.subject,
//     });

//     if (!currentUser) {
//       throw new ConvexError("Usuario no encontrado");
//     }

//     const conversationId = await ctx.db.insert("conversations", {
//       isGroup: true,
//       name: args.name,
//     });

//     await Promise.all(
//       [...args.members, currentUser._id].map(async (memberId) => {
//         await ctx.db.insert("conversationMembers", {
//           memberId,
//           conversationId,
//         });
//       })
//     );
//   },
// });
