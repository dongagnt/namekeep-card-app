export function downloadCSV(cards) {
  const header = ['이름', '회사명', '주소', '핸드폰', '전화번호', '이메일', '홈페이지'];

  const rows = cards.map(card => [
    card.name || '',
    card.company || '',
    card.address || '',
    card.mobile || '',
    card.phone || '',
    card.email || '',
    card.website || ''
  ]);

  const csvContent =
    '\uFEFF' + // BOM 추가로 Excel 한글 깨짐 방지
    [header, ...rows]
      .map(row => row.map(value => `"${value}"`).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'namecards.csv';
  a.click();
  URL.revokeObjectURL(url);
}
