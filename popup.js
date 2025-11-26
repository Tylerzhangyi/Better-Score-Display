function renderTable(list) {
  let html = `
    <table>
      <tr>
        <th>课程名</th>
        <th>成绩</th>
        <th>最高分</th>
        <th>最低分</th>
        <th>平均分</th>
      </tr>
  `;

  list.forEach(c => {
    html += `
      <tr>
        <td>${c.courseName}</td>
        <td>${c.courseScore ?? "-"}</td>
        <td>${c.maximumCourseScore ?? "-"}</td>
        <td>${c.minimumCourseScore ?? "-"}</td>
        <td>${c.courseAverage ?? "-"}</td>
      </tr>
    `;
  });

  html += `</table>`;
  return html;
}

chrome.storage.local.get("gradeData", (res) => {
  const data = res.gradeData;

  if (!data || !data.content) {
    document.getElementById("status").innerText = "未找到成绩，请刷新页面后重新打开扩展。";
    return;
  }

  document.getElementById("status").style.display = "none";
  document.getElementById("table").innerHTML = renderTable(data.content);
});
