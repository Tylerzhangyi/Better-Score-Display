function renderTable(list) {
  if (!list || list.length === 0) {
    return '<div class="empty-message">暂无成绩数据</div>';
  }

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
    const score = c.courseScore ?? "-";
    let chipClass = "score-chip";
    let scoreStyle = "";

    if (score !== "-") {
      const scoreNum = parseFloat(score);
      if (!isNaN(scoreNum)) {
        // 颜色等级使用四舍五入后的分数
        const rounded = Math.round(scoreNum);

        let scoreColor = "#667eea";
        let scoreBg = "rgba(102, 126, 234, 0.15)";

        if (rounded >= 95) {
          chipClass += " score-level5";
          scoreColor = "#764ba2";
          scoreBg = "rgba(118, 75, 162, 0.15)";
        } else if (rounded >= 85) {
          chipClass += " score-level4";
          scoreColor = "#17a2b8";
          scoreBg = "rgba(23, 162, 184, 0.18)";
        } else if (rounded >= 70) {
          chipClass += " score-level3";
          scoreColor = "#28a745";
          scoreBg = "rgba(40, 167, 69, 0.15)";
        } else if (rounded >= 60) {
          chipClass += " score-level2";
          scoreColor = "#ffc107";
          scoreBg = "rgba(255, 193, 7, 0.2)";
        } else if (rounded >= 50) {
          chipClass += " score-level1";
          scoreColor = "#ff9800";
          scoreBg = "rgba(255, 152, 0, 0.2)";
        } else {
          chipClass += " score-levelF";
          scoreColor = "#dc3545";
          scoreBg = "rgba(220, 53, 69, 0.18)";
        }

        // 高亮逻辑：如果该科目中，你的分数等于年级最高分或最低分
        const maxStr = c.maximumCourseScore ?? null;
        const minStr = c.minimumCourseScore ?? null;
        const EPS = 1e-6;

        if (maxStr != null && maxStr !== "-") {
          const maxNum = parseFloat(maxStr);
          if (!isNaN(maxNum) && Math.abs(scoreNum - maxNum) < EPS) {
            chipClass += " score-max";
          }
        }

        if (minStr != null && minStr !== "-") {
          const minNum = parseFloat(minStr);
          if (!isNaN(minNum) && Math.abs(scoreNum - minNum) < EPS) {
            chipClass += " score-min";
          }
        }

        scoreStyle = ` style="--score-color:${scoreColor}; --score-bg:${scoreBg}"`;
      }
    } else {
      chipClass += " score-empty";
    }
    
    html += `
      <tr>
        <td>${c.courseName || "-"}</td>
        <td>
          <span class="${chipClass}"${scoreStyle}>${score}</span>
        </td>
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
  const statusEl = document.getElementById("status");
  const tableEl = document.getElementById("table");
  const titleEl = document.getElementById("header-title");

  // 更新标题，从content数组第一个元素的semesterName中获取
  if (titleEl && data?.content && data.content.length > 0 && data.content[0]?.semesterName) {
    titleEl.textContent = `${data.content[0].semesterName}成绩`;
  } else if (titleEl) {
    titleEl.textContent = "Yungu 成绩表";
  }

  if (!data || !data.content) {
    statusEl.innerHTML = `
      <div class="empty-message">
        <div style="font-size: 48px; margin-bottom: 12px;">📋</div>
        <div>未找到成绩数据</div>
        <div style="font-size: 13px; color: #999; margin-top: 8px;">请刷新页面后重新打开扩展</div>
      </div>
    `;
    return;
  }

  statusEl.style.display = "none";
  tableEl.innerHTML = renderTable(data.content);
  
  // 添加提示文字
  const tipEl = document.createElement("div");
  tipEl.className = "refresh-tip";
  tipEl.textContent = "如果未显示成绩，请用 Command+Shift+R 强制刷新网页";
  tableEl.appendChild(tipEl);
});
