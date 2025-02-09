export async function GET() {
    const shifts = [
      { id: 1, name: "田中", date: "2025-02-10" },
      { id: 2, name: "佐藤", date: "2025-02-11" },
    ];
    return Response.json(shifts);
  }
  