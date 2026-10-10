import mongoose from "mongoose";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node --env-file=.env.local scripts/promote-super-admin.mjs <email> [tenantId]");
  process.exitCode = 1;
} else {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/buroia";
    await mongoose.connect(uri);
    const users = mongoose.connection.collection("users");
    const user = await users.findOne({ email });
    if (!user) {
      console.error(`No BUROIA account found for ${email}. Register the account first.`);
      process.exitCode = 1;
    } else {
      const tenantId = process.argv[3] || user.tenantId || String(user._id);
      await users.updateOne({ _id: user._id }, { $set: { role: "SUPER_ADMIN", tenantId, isActive: true } });
      console.log(`Granted SUPER_ADMIN to ${email} for tenant ${tenantId}.`);
    }
  } catch (error) {
    console.error("Could not update the account role:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}
