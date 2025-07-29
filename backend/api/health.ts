export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  })
}