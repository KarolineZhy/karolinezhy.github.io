// Data model
let projects = [];
let currentEditingProject = null;
let currentEditingSubProject = null;
let currentParentProject = null;
let currentCategory = null;
let selectedSubProject = null; // {projectIndex, subIndex}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderProjects();
    initEventListeners();
});

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('phdProjects');
    if (savedData) {
        try {
            projects = JSON.parse(savedData);
            // Migrate old data
            projects = projects.map(p => {
                const category = p.category || 'algorithm';
                const color = category === 'algorithm' ? '#5B8DBE' : '#59A985';
                return {
                    ...p,
                    category,
                    color,
                    subProjects: (p.subProjects || []).map(sp => ({
                        ...sp,
                        updates: sp.updates || [],
                        documents: sp.documents || [],
                        links: sp.links || []
                    }))
                };
            });
        } catch (e) {
            console.error('Failed to load data:', e);
            projects = [];
        }
    }
}

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('phdProjects', JSON.stringify(projects));
        console.log('Data saved successfully at', new Date().toLocaleTimeString());
    } catch (e) {
        console.error('Failed to save data:', e);
        alert('Failed to save. Please check your browser storage.');
    }
}

// Initialize event listeners
function initEventListeners() {
    // Add project buttons
    document.getElementById('addAlgorithmBtn').addEventListener('click', function() {
        currentEditingProject = null;
        currentCategory = 'algorithm';
        openProjectModal();
    });

    document.getElementById('addHospitalBtn').addEventListener('click', function() {
        currentEditingProject = null;
        currentCategory = 'hospital';
        openProjectModal();
    });

    // Save project
    document.getElementById('saveProjectBtn').addEventListener('click', saveProject);
    document.getElementById('cancelProjectBtn').addEventListener('click', closeProjectModal);

    // Save subproject
    document.getElementById('saveSubProjectBtn').addEventListener('click', saveSubProject);
    document.getElementById('cancelSubProjectBtn').addEventListener('click', closeSubProjectModal);

    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeProjectModal();
            closeSubProjectModal();
        });
    });

    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeProjectModal();
            closeSubProjectModal();
        }
    });

    // Export data
    document.getElementById('exportBtn').addEventListener('click', exportData);

    // Import data
    document.getElementById('importBtn').addEventListener('click', function() {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);
}

// Render all projects
function renderProjects(skipDetailRefresh = false) {
    const algorithmProjects = projects.filter(p => p.category === 'algorithm');
    const hospitalProjects = projects.filter(p => p.category === 'hospital');

    renderCategoryProjects('algorithm', algorithmProjects);
    renderCategoryProjects('hospital', hospitalProjects);

    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (projects.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Re-render detail panel if a subproject is selected (unless explicitly skipped)
    if (!skipDetailRefresh && selectedSubProject) {
        showSubProjectDetail(selectedSubProject.projectIndex, selectedSubProject.subIndex);
    }
}

// Render projects for a specific category
function renderCategoryProjects(category, categoryProjects) {
    const containerId = category === 'algorithm' ? 'algorithmContainer' : 'hospitalContainer';
    const container = document.getElementById(containerId);

    if (categoryProjects.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = categoryProjects.map(project => {
        const projectIndex = projects.indexOf(project);
        const subProjects = project.subProjects || [];
        const levels = buildDependencyLevels(subProjects);

        return `
            <div class="tree-project">
                <div class="tree-project-header">
                    <div class="tree-project-node" style="border-color: ${project.color}; color: ${project.color}">
                        <h3>${escapeHtml(project.name)}</h3>
                        <p>${escapeHtml(project.description || '')}</p>
                    </div>
                    <div class="tree-project-actions">
                        <button class="tree-icon-btn" onclick="editProject(${projectIndex})" title="Edit">✏️</button>
                        <button class="tree-icon-btn" onclick="deleteProject(${projectIndex})" title="Delete">🗑️</button>
                    </div>
                </div>

                <div class="tree-subprojects">
                    ${renderTreeLevels(levels, projectIndex)}
                    <button class="tree-add-btn" onclick="addSubProject(${projectIndex})">
                        + Add Subproject
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Build dependency levels for tree layout
function buildDependencyLevels(subProjects) {
    if (!subProjects || subProjects.length === 0) return [];

    const levels = [];
    const processed = new Set();
    const subProjectsWithIndex = subProjects.map((sp, idx) => ({ ...sp, originalIndex: idx }));

    let currentLevel = subProjectsWithIndex.filter(sp => !sp.dependsOn);

    while (currentLevel.length > 0) {
        levels.push(currentLevel);
        currentLevel.forEach(sp => processed.add(sp.originalIndex));

        currentLevel = subProjectsWithIndex.filter(sp =>
            !processed.has(sp.originalIndex) &&
            sp.dependsOn !== undefined &&
            processed.has(parseInt(sp.dependsOn))
        );

        if (currentLevel.length === 0 && processed.size < subProjects.length) {
            const remaining = subProjectsWithIndex.filter(sp => !processed.has(sp.originalIndex));
            if (remaining.length > 0) {
                levels.push(remaining);
            }
            break;
        }
    }

    return levels;
}

// Render tree levels
function renderTreeLevels(levels, projectIndex) {
    return levels.map(level => {
        if (level.length === 1) {
            return renderTreeSubProject(level[0], projectIndex);
        } else {
            return `
                <div class="tree-level-parallel">
                    ${level.map(sp => renderTreeSubProject(sp, projectIndex)).join('')}
                </div>
            `;
        }
    }).join('');
}

// Render tree subproject node
function renderTreeSubProject(subProject, projectIndex) {
    const statusClass = `status-${subProject.status || 'planned'}`;
    const statusText = getStatusText(subProject.status);
    const hasDependency = subProject.dependsOn !== undefined && subProject.dependsOn !== '';
    const isActive = selectedSubProject &&
                     selectedSubProject.projectIndex === projectIndex &&
                     selectedSubProject.subIndex === subProject.originalIndex;

    let publicationHtml = '';
    if (subProject.publication && subProject.publication.status) {
        const pubStatusClass = `pub-status-${subProject.publication.status}`;
        const pubStatusText = getPubStatusText(subProject.publication.status);
        publicationHtml = `
            <div class="tree-subproject-publication">
                <div class="pub-title">📄 ${escapeHtml(subProject.publication.title || 'Untitled')}</div>
                <div class="pub-meta">
                    ${subProject.publication.venue ? `<span>📍 ${escapeHtml(subProject.publication.venue)}</span>` : ''}
                    <span class="status-badge ${pubStatusClass}">${pubStatusText}</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="tree-subproject-node ${hasDependency ? 'has-dependency' : ''} ${isActive ? 'active' : ''}"
             onclick="showSubProjectDetail(${projectIndex}, ${subProject.originalIndex})">
            <div class="tree-subproject-header">
                <div class="tree-subproject-title">${escapeHtml(subProject.name)}</div>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="tree-subproject-meta">
                ${subProject.owner ? `<span>👤 ${escapeHtml(subProject.owner)}</span>` : ''}
                ${subProject.startDate ? `<span>📅 ${subProject.startDate}</span>` : ''}
                ${subProject.progress !== undefined ? `<span>📊 ${subProject.progress}%</span>` : ''}
            </div>
            ${publicationHtml}
        </div>
    `;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'planned': 'Planned',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'on-hold': 'On Hold'
    };
    return statusMap[status] || 'Planned';
}

// Get publication status text
function getPubStatusText(status) {
    const statusMap = {
        'ongoing': 'Ongoing',
        'submitted': 'Submitted',
        'accepted': 'Accepted'
    };
    return statusMap[status] || '';
}

// Show subproject detail in right panel
function showSubProjectDetail(projectIndex, subIndex) {
    selectedSubProject = { projectIndex, subIndex };

    const project = projects[projectIndex];
    const sub = project.subProjects[subIndex];

    const placeholder = document.querySelector('.detail-panel-placeholder');
    const content = document.getElementById('detailContent');

    placeholder.style.display = 'none';
    content.style.display = 'block';

    const statusClass = `status-${sub.status || 'planned'}`;
    const statusText = getStatusText(sub.status);

    const dependencyText = sub.dependsOn !== undefined && sub.dependsOn !== ''
        ? escapeHtml(project.subProjects[parseInt(sub.dependsOn)].name)
        : 'None (Independent)';

    // Progress circle calculation
    const progress = sub.progress || 0;
    const circumference = 2 * Math.PI * 52; // radius = 52
    const offset = circumference - (progress / 100) * circumference;

    let publicationHtml = '';
    if (sub.publication && sub.publication.status) {
        const pubStatusClass = `pub-status-${sub.publication.status}`;
        const pubStatusText = getPubStatusText(sub.publication.status);
        publicationHtml = `
            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Title</span>
                    <span class="info-value">${escapeHtml(sub.publication.title || 'Untitled')}</span>
                </div>
                ${sub.publication.venue ? `
                    <div class="info-row">
                        <span class="info-label">Venue</span>
                        <span class="info-value">${escapeHtml(sub.publication.venue)}</span>
                    </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Status</span>
                    <span class="status-badge ${pubStatusClass}">${pubStatusText}</span>
                </div>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="detail-header">
            <div class="detail-title">${escapeHtml(sub.name)}</div>
            <div class="detail-meta">
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${sub.owner ? `<span style="color: var(--text-secondary); font-size: 13px;">👤 ${escapeHtml(sub.owner)}</span>` : ''}
            </div>
            ${sub.description ? `<p style="color: var(--text-secondary); font-size: 14px; margin-top: 12px;">${escapeHtml(sub.description)}</p>` : ''}
            <div class="detail-actions">
                <button class="btn btn-primary btn-small" onclick="editSubProject(${projectIndex}, ${subIndex})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteSubProject(${projectIndex}, ${subIndex})">Delete</button>
            </div>
        </div>

        <div class="detail-section">
            <div class="detail-section-title">Progress</div>
            <div class="progress-visual">
                <div class="progress-circle-container">
                    <div class="progress-circle">
                        <svg width="120" height="120">
                            <circle class="progress-circle-bg" cx="60" cy="60" r="52"></circle>
                            <circle class="progress-circle-fill" cx="60" cy="60" r="52"
                                    stroke-dasharray="${circumference}"
                                    stroke-dashoffset="${offset}"></circle>
                        </svg>
                        <div class="progress-text">${progress}%</div>
                    </div>
                </div>
                <div class="info-box">
                    ${sub.startDate || sub.endDate ? `
                        <div class="info-row">
                            <span class="info-label">Timeline</span>
                            <span class="info-value">${sub.startDate || 'Not set'} ~ ${sub.endDate || 'Not set'}</span>
                        </div>
                    ` : ''}
                    <div class="info-row">
                        <span class="info-label">Dependency</span>
                        <span class="info-value">${dependencyText}</span>
                    </div>
                </div>
            </div>
        </div>

        ${sub.publication && sub.publication.status ? `
            <div class="detail-section">
                <div class="detail-section-title">📄 Publication</div>
                ${publicationHtml}
            </div>
        ` : ''}

        <div class="detail-section">
            <div class="detail-section-title">📝 Progress Updates</div>
            ${renderTimeline(projectIndex, subIndex, sub.updates || [])}
        </div>

        <div class="detail-section">
            <div class="detail-section-title">📎 Documents</div>
            ${renderDocuments(projectIndex, subIndex, sub.documents || [])}
        </div>

        <div class="detail-section">
            <div class="detail-section-title">🔗 Links & Meetings</div>
            ${renderLinks(projectIndex, subIndex, sub.links || [])}
        </div>

        ${sub.notes ? `
            <div class="detail-section">
                <div class="detail-section-title">Notes</div>
                <div style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">${escapeHtml(sub.notes).replace(/\n/g, '<br>')}</div>
            </div>
        ` : ''}
    `;

    // Re-render projects to update active state
    renderProjects();
}

// Render timeline
function renderTimeline(projectIndex, subIndex, updates) {
    const timelineItems = updates.map((update, idx) => `
        <div class="timeline-item">
            <div class="timeline-date">${update.date}</div>
            <div class="timeline-content">
                <div class="timeline-text">${escapeHtml(update.text)}</div>
                <button class="icon-btn-small" onclick="deleteUpdate(${projectIndex}, ${subIndex}, ${idx})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');

    return `
        ${timelineItems || '<p style="color: var(--text-tertiary); font-size: 14px;">No updates yet</p>'}
        <div class="timeline-add">
            <textarea class="timeline-input" id="newUpdate" placeholder="Add a progress update..."></textarea>
            <button class="btn btn-primary btn-small" onclick="addUpdate(${projectIndex}, ${subIndex})">Add Update</button>
        </div>
    `;
}

// Add update
function addUpdate(projectIndex, subIndex) {
    const input = document.getElementById('newUpdate');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter an update');
        return;
    }

    const update = {
        date: new Date().toISOString().split('T')[0],
        text: text
    };

    if (!projects[projectIndex].subProjects[subIndex].updates) {
        projects[projectIndex].subProjects[subIndex].updates = [];
    }

    projects[projectIndex].subProjects[subIndex].updates.unshift(update);
    saveData();
    showSubProjectDetail(projectIndex, subIndex);
}

// Delete update
function deleteUpdate(projectIndex, subIndex, updateIndex) {
    if (confirm('Delete this update?')) {
        projects[projectIndex].subProjects[subIndex].updates.splice(updateIndex, 1);
        saveData();
        showSubProjectDetail(projectIndex, subIndex);
    }
}

// Render documents
function renderDocuments(projectIndex, subIndex, documents) {
    const docItems = documents.map((doc, idx) => `
        <div class="document-item">
            <div class="document-info">
                <span class="document-icon">📄</span>
                <span class="document-name">${escapeHtml(doc.name)}</span>
            </div>
            <div class="document-actions">
                ${doc.url ? `<a href="${escapeHtml(doc.url)}" target="_blank" class="icon-btn-small" title="Open">🔗</a>` : ''}
                <button class="icon-btn-small" onclick="deleteDocument(${projectIndex}, ${subIndex}, ${idx})" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');

    return `
        <div class="document-list">
            ${docItems || '<p style="color: var(--text-tertiary); font-size: 14px;">No documents yet</p>'}
        </div>
        <div class="document-upload">
            <div class="file-input-wrapper">
                <label class="file-input-label">
                    📎 Upload Document
                    <input type="file" class="file-input" onchange="uploadDocument(${projectIndex}, ${subIndex}, this)">
                </label>
            </div>
            <div style="margin-top: 12px;">
                <input type="text" class="link-input" id="docUrl${projectIndex}_${subIndex}" placeholder="Or paste a document URL" style="margin-bottom: 8px;">
                <button class="btn btn-secondary btn-small" onclick="addDocumentUrl(${projectIndex}, ${subIndex})">Add URL</button>
            </div>
        </div>
    `;
}

// Upload document
function uploadDocument(projectIndex, subIndex, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const doc = {
            name: file.name,
            data: e.target.result,
            type: file.type
        };

        if (!projects[projectIndex].subProjects[subIndex].documents) {
            projects[projectIndex].subProjects[subIndex].documents = [];
        }

        projects[projectIndex].subProjects[subIndex].documents.push(doc);
        saveData();
        showSubProjectDetail(projectIndex, subIndex);
    };
    reader.readAsDataURL(file);
}

// Add document URL
function addDocumentUrl(projectIndex, subIndex) {
    const input = document.getElementById(`docUrl${projectIndex}_${subIndex}`);
    const url = input.value.trim();

    if (!url) {
        alert('Please enter a URL');
        return;
    }

    const doc = {
        name: url.split('/').pop() || 'Document',
        url: url
    };

    if (!projects[projectIndex].subProjects[subIndex].documents) {
        projects[projectIndex].subProjects[subIndex].documents = [];
    }

    projects[projectIndex].subProjects[subIndex].documents.push(doc);
    saveData();
    showSubProjectDetail(projectIndex, subIndex);
}

// Delete document
function deleteDocument(projectIndex, subIndex, docIndex) {
    if (confirm('Delete this document?')) {
        projects[projectIndex].subProjects[subIndex].documents.splice(docIndex, 1);
        saveData();
        showSubProjectDetail(projectIndex, subIndex);
    }
}

// Render links
function renderLinks(projectIndex, subIndex, links) {
    const linkItems = links.map((link, idx) => `
        <div class="link-item">
            <div class="link-info">
                <div class="link-title">${escapeHtml(link.title)}</div>
                <a href="${escapeHtml(link.url)}" target="_blank" class="link-url">${escapeHtml(link.url)}</a>
            </div>
            <button class="icon-btn-small" onclick="deleteLink(${projectIndex}, ${subIndex}, ${idx})" title="Delete">🗑️</button>
        </div>
    `).join('');

    return `
        <div class="link-list">
            ${linkItems || '<p style="color: var(--text-tertiary); font-size: 14px;">No links yet</p>'}
        </div>
        <div class="link-add">
            <input type="text" class="link-input" id="linkTitle${projectIndex}_${subIndex}" placeholder="Link title (e.g., Team Meeting)">
            <input type="text" class="link-input" id="linkUrl${projectIndex}_${subIndex}" placeholder="URL (e.g., https://zoom.us/...)">
            <button class="btn btn-primary btn-small" onclick="addLink(${projectIndex}, ${subIndex})">Add Link</button>
        </div>
    `;
}

// Add link
function addLink(projectIndex, subIndex) {
    const titleInput = document.getElementById(`linkTitle${projectIndex}_${subIndex}`);
    const urlInput = document.getElementById(`linkUrl${projectIndex}_${subIndex}`);

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url) {
        alert('Please enter both title and URL');
        return;
    }

    const link = { title, url };

    if (!projects[projectIndex].subProjects[subIndex].links) {
        projects[projectIndex].subProjects[subIndex].links = [];
    }

    projects[projectIndex].subProjects[subIndex].links.push(link);
    saveData();
    showSubProjectDetail(projectIndex, subIndex);
}

// Delete link
function deleteLink(projectIndex, subIndex, linkIndex) {
    if (confirm('Delete this link?')) {
        projects[projectIndex].subProjects[subIndex].links.splice(linkIndex, 1);
        saveData();
        showSubProjectDetail(projectIndex, subIndex);
    }
}

// Open project modal
function openProjectModal() {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');

    if (currentEditingProject !== null) {
        title.textContent = 'Edit Project';
        const project = projects[currentEditingProject];
        currentCategory = project.category;
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDesc').value = project.description || '';
    } else {
        title.textContent = `New ${currentCategory === 'algorithm' ? 'Algorithm' : 'Hospital'} Project`;
        document.getElementById('projectName').value = '';
        document.getElementById('projectDesc').value = '';
    }

    document.getElementById('projectCategory').value = currentCategory;
    modal.classList.add('show');
}

// Close project modal
function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
}

// Save project
function saveProject() {
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDesc').value.trim();
    const category = document.getElementById('projectCategory').value;

    if (!name) {
        alert('Please enter a project name');
        return;
    }

    const color = category === 'algorithm' ? '#5B8DBE' : '#59A985';

    const projectData = {
        name,
        description,
        color,
        category,
        subProjects: currentEditingProject !== null ? projects[currentEditingProject].subProjects : []
    };

    if (currentEditingProject !== null) {
        projects[currentEditingProject] = projectData;

        // Update selectedSubProject if this is the project containing the selected subproject
        if (selectedSubProject && selectedSubProject.projectIndex === currentEditingProject) {
            // Keep the selection after editing the parent project
            selectedSubProject = {
                projectIndex: currentEditingProject,
                subIndex: selectedSubProject.subIndex
            };
        }
    } else {
        projects.push(projectData);
    }

    saveData();
    closeProjectModal();
    renderProjects(true); // Skip auto-refresh since we'll do it manually

    // Refresh detail panel if a subproject is selected
    if (selectedSubProject) {
        showSubProjectDetail(selectedSubProject.projectIndex, selectedSubProject.subIndex);
    }
}

// Edit project
function editProject(index) {
    currentEditingProject = index;
    openProjectModal();
}

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project and all its subprojects?')) {
        // Clear detail panel if deleted project's subproject is selected
        if (selectedSubProject && selectedSubProject.projectIndex === index) {
            selectedSubProject = null;
            document.querySelector('.detail-panel-placeholder').style.display = 'flex';
            document.getElementById('detailContent').style.display = 'none';
        }

        projects.splice(index, 1);
        saveData();
        renderProjects();
    }
}

// Add subproject
function addSubProject(projectIndex) {
    currentParentProject = projectIndex;
    currentEditingSubProject = null;
    openSubProjectModal();
}

// Edit subproject
function editSubProject(projectIndex, subIndex) {
    if (event) event.stopPropagation();
    currentParentProject = projectIndex;
    currentEditingSubProject = subIndex;
    openSubProjectModal();
}

// Delete subproject
function deleteSubProject(projectIndex, subIndex) {
    if (event) event.stopPropagation();
    if (confirm('Are you sure you want to delete this subproject?')) {
        // Handle selection state
        if (selectedSubProject && selectedSubProject.projectIndex === projectIndex) {
            if (selectedSubProject.subIndex === subIndex) {
                // Deleting the selected subproject - clear selection
                selectedSubProject = null;
                document.querySelector('.detail-panel-placeholder').style.display = 'flex';
                document.getElementById('detailContent').style.display = 'none';
            } else if (selectedSubProject.subIndex > subIndex) {
                // Selected subproject is after the deleted one - adjust index
                selectedSubProject.subIndex -= 1;
            }
        }

        projects[projectIndex].subProjects.splice(subIndex, 1);
        saveData();
        renderProjects(true); // Skip auto-refresh since we'll do it manually

        // Refresh detail panel if still selected
        if (selectedSubProject && selectedSubProject.projectIndex === projectIndex) {
            showSubProjectDetail(selectedSubProject.projectIndex, selectedSubProject.subIndex);
        }
    }
}

// Open subproject modal
function openSubProjectModal() {
    const modal = document.getElementById('subProjectModal');
    const title = document.getElementById('subProjectModalTitle');
    const dependencySelect = document.getElementById('subProjectDependency');

    const subProjects = projects[currentParentProject].subProjects || [];
    dependencySelect.innerHTML = '<option value="">None (Parallel/Independent)</option>';

    subProjects.forEach((sp, idx) => {
        if (currentEditingSubProject === null || idx !== currentEditingSubProject) {
            dependencySelect.innerHTML += `<option value="${idx}">${escapeHtml(sp.name)}</option>`;
        }
    });

    if (currentEditingSubProject !== null) {
        title.textContent = 'Edit Subproject';
        const sub = projects[currentParentProject].subProjects[currentEditingSubProject];
        document.getElementById('subProjectName').value = sub.name;
        document.getElementById('subProjectDesc').value = sub.description || '';
        document.getElementById('subProjectDependency').value = sub.dependsOn || '';
        document.getElementById('subProjectOwner').value = sub.owner || '';
        document.getElementById('subProjectStart').value = sub.startDate || '';
        document.getElementById('subProjectEnd').value = sub.endDate || '';
        document.getElementById('subProjectStatus').value = sub.status || 'planned';
        document.getElementById('subProjectProgress').value = sub.progress || 0;
        document.getElementById('subProjectNotes').value = sub.notes || '';

        document.getElementById('subProjectPubTitle').value = sub.publication?.title || '';
        document.getElementById('subProjectPubVenue').value = sub.publication?.venue || '';
        document.getElementById('subProjectPubStatus').value = sub.publication?.status || '';
    } else {
        title.textContent = 'New Subproject';
        document.getElementById('subProjectName').value = '';
        document.getElementById('subProjectDesc').value = '';
        document.getElementById('subProjectDependency').value = '';
        document.getElementById('subProjectOwner').value = '';
        document.getElementById('subProjectStart').value = '';
        document.getElementById('subProjectEnd').value = '';
        document.getElementById('subProjectStatus').value = 'planned';
        document.getElementById('subProjectProgress').value = 0;
        document.getElementById('subProjectNotes').value = '';

        document.getElementById('subProjectPubTitle').value = '';
        document.getElementById('subProjectPubVenue').value = '';
        document.getElementById('subProjectPubStatus').value = '';
    }

    modal.classList.add('show');
}

// Close subproject modal
function closeSubProjectModal() {
    document.getElementById('subProjectModal').classList.remove('show');
}

// Save subproject
function saveSubProject() {
    const name = document.getElementById('subProjectName').value.trim();
    const description = document.getElementById('subProjectDesc').value.trim();
    const dependsOn = document.getElementById('subProjectDependency').value;
    const owner = document.getElementById('subProjectOwner').value.trim();
    const startDate = document.getElementById('subProjectStart').value;
    const endDate = document.getElementById('subProjectEnd').value;
    const status = document.getElementById('subProjectStatus').value;
    const progress = parseInt(document.getElementById('subProjectProgress').value) || 0;
    const notes = document.getElementById('subProjectNotes').value.trim();

    const pubTitle = document.getElementById('subProjectPubTitle').value.trim();
    const pubVenue = document.getElementById('subProjectPubVenue').value.trim();
    const pubStatus = document.getElementById('subProjectPubStatus').value;

    if (!name) {
        alert('Please enter a subproject name');
        return;
    }

    const subProjectData = {
        name,
        description,
        dependsOn: dependsOn || undefined,
        owner,
        startDate,
        endDate,
        status,
        progress,
        notes,
        updates: currentEditingSubProject !== null ?
                 projects[currentParentProject].subProjects[currentEditingSubProject].updates || [] : [],
        documents: currentEditingSubProject !== null ?
                   projects[currentParentProject].subProjects[currentEditingSubProject].documents || [] : [],
        links: currentEditingSubProject !== null ?
               projects[currentParentProject].subProjects[currentEditingSubProject].links || [] : []
    };

    if (pubStatus) {
        subProjectData.publication = {
            title: pubTitle,
            venue: pubVenue,
            status: pubStatus
        };
    }

    if (!projects[currentParentProject].subProjects) {
        projects[currentParentProject].subProjects = [];
    }

    if (currentEditingSubProject !== null) {
        projects[currentParentProject].subProjects[currentEditingSubProject] = subProjectData;

        // Update selectedSubProject if we're editing the currently selected one
        if (selectedSubProject &&
            selectedSubProject.projectIndex === currentParentProject &&
            selectedSubProject.subIndex === currentEditingSubProject) {
            // Keep it selected and refresh the detail panel after render
            selectedSubProject = { projectIndex: currentParentProject, subIndex: currentEditingSubProject };
        }
    } else {
        const newIndex = projects[currentParentProject].subProjects.push(subProjectData) - 1;

        // Auto-select newly created subproject
        selectedSubProject = { projectIndex: currentParentProject, subIndex: newIndex };
    }

    saveData();
    closeSubProjectModal();
    renderProjects(true); // Skip auto-refresh since we'll do it manually

    // Refresh detail panel if a subproject is selected
    if (selectedSubProject) {
        showSubProjectDetail(selectedSubProject.projectIndex, selectedSubProject.subIndex);
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phd-projects-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedProjects = JSON.parse(e.target.result);
            if (Array.isArray(importedProjects)) {
                if (confirm('Importing will overwrite all current data. Continue?')) {
                    projects = importedProjects;
                    saveData();
                    selectedSubProject = null;
                    document.querySelector('.detail-panel-placeholder').style.display = 'flex';
                    document.getElementById('detailContent').style.display = 'none';
                    renderProjects();
                    alert('Import successful!');
                }
            } else {
                alert('Invalid data format');
            }
        } catch (error) {
            alert('Import failed: Invalid file format');
            console.error(error);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
