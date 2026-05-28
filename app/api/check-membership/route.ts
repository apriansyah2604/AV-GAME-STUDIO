import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // 1. Get User ID from Username
    const userRes = await fetch('https://users.roblox.com/v1/usernames/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
    });
    
    const userData = await userRes.json();
    
    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userData.data[0].id;

    // 2. Check Group Membership (Group ID: 390244299)
    const groupRes = await fetch(`https://groups.roblox.com/v1/users/${userId}/groups/roles`);
    const groupData = await groupRes.json();

    if (!groupData.data) {
      return NextResponse.json({ isMember: false });
    }

    const isMember = groupData.data.some((group: any) => group.group.id === 390244299);

    return NextResponse.json({ isMember });
  } catch (error) {
    console.error('Membership Check API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
