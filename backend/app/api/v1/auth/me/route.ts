import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')
  const email = request.headers.get('x-user-email')
  const role = request.headers.get('x-user-role')

  if (!userId) {return NextResponse.json({message: 'Unauthorized request'}, {status: 401})}

  return NextResponse.json({
    message: 'Authorized request',
    user: {id: userId, email, role},
  })
}
