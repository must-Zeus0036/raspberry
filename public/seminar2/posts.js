document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const postsContainer = document.querySelector(".postsContainer");
    const profileCard = document.getElementById("profileCard");
    const userProfile = document.getElementById("user-profile");
    const closeProfileCard = document.querySelector(".close-profile-card");

    document.body.style.backgroundColor = "black";

    let skip = 0;
    const limit = 10;
    let loading = false;

    createNavigation(header);
    displayPosts();

    // Close profile card when clicking outside
    window.onclick = function (event) {
        if (event.target === profileCard) {
            profileCard.style.display = "none";
        }
    };

    // Close profile card when clicking the close button
    closeProfileCard.addEventListener("click", () => {
        profileCard.style.display = "none";
    });

    // Infinite Scroll - Load more posts when scrolling down
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading) {
            displayPosts();
        }
    });

    function createNavigation(header) {
        const nav = document.createElement("nav");
        const ul = document.createElement("ul");

        const navItems = [
            { text: "Home", link: "index.html" },
            { text: "Posts", link: "posts.html" },
            { text: "Contact", link: "contact.html" },
        ];

        navItems.forEach(({ text, link }) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link;
            a.textContent = text;
            a.classList.add("nav-link");
            li.appendChild(a);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        header.appendChild(nav);
        highlightCurrentPage();
    }

    function highlightCurrentPage() {
        const path = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll(".nav-link").forEach((link) => {
            if (link.getAttribute("href") === path) {
                link.style.backgroundColor = "rgb(0, 140, 255)";
                link.style.color = "white";
                link.style.fontWeight = "bold";
                link.style.borderRadius = "5px";
                link.style.padding = "10px";
            } else {
                link.style.backgroundColor = "";
                link.style.color = "";
                link.style.fontWeight = "";
            }
        });
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    async function fetchPosts(skip) {
        const data = await fetchData(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
        return data ? data.posts : [];
    }

    async function fetchUser(userId) {
        return await fetchData(`https://dummyjson.com/users/${userId}`);
    }

    async function fetchComments(postId) {
        const data = await fetchData(`https://dummyjson.com/comments/post/${postId}`);
        return data ? data.comments : [];
    }

    async function displayPosts() {
        if (loading) return;
        loading = true;

        const posts = await fetchPosts(skip);
        skip += limit;

        for (const post of posts) {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            const user = await fetchUser(post.userId);
            const comments = await fetchComments(post.id);

            postElement.innerHTML = createPostHTML(post, user, comments);
            postsContainer.appendChild(postElement);
        }

        attachEventListeners();
        loading = false;
    }

    function createPostHTML(post, user, comments) {
        let tagsHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join(" ");
        let commentsCount = comments.length;

        return `
            <h2>${post.title}</h2>
            <p>
                <img src="${user.image}" alt="Profile picture of ${user.username}" class="user-profile-image">
                <span class="username" data-user-id="${post.userId}">${user.username}</span>
            </p>
            <div class="tags"><p>🎬 Tags:</p> ${tagsHTML}</div>
            <p>👀 Views: ${post.views}</p>
            <p>👍 Likes: ${post.reactions.likes}, 👎 Dislikes: ${post.reactions.dislikes}</p>
            <button class="toggle-comments-btn" data-post-id="${post.id}">Show Comments (${commentsCount})</button>
            <div class="comments-container" id="comments-${post.id}" style="display: none;">
                <p>Loading comments...</p>
            </div>
        `;
    }

    function attachEventListeners() {
        document.querySelectorAll(".username").forEach(username => {
            username.addEventListener("click", async () => {
                const userId = username.dataset.userId;
                await displayUserProfile(userId);
            });
        });

        document.querySelectorAll(".toggle-comments-btn").forEach(button => {
            button.addEventListener("click", async () => {
                const postId = button.dataset.postId;
                const commentsContainer = document.getElementById(`comments-${postId}`);

                if (commentsContainer.style.display === "none") {
                    commentsContainer.style.display = "block";
                    button.textContent = button.textContent.replace("Show", "Hide");

                    // Fetch and display comments if not already loaded
                    if (!commentsContainer.dataset.loaded) {
                        const comments = await fetchComments(postId);
                        commentsContainer.innerHTML = comments.length
                            ? comments.map(comment => `<div class="comment"><strong>${comment.user.username}:</strong> ${comment.body} 👍${comment.likes}</div>`).join('')
                            : "<p>No comments available</p>";

                        commentsContainer.dataset.loaded = "true";
                    }
                } else {
                    commentsContainer.style.display = "none";
                    button.textContent = button.textContent.replace("Hide", "Show");
                }
            });
        });
    }

    async function displayUserProfile(userId) {
        const user = await fetchUser(userId);
        if (user) {
            userProfile.innerHTML = `
                <img src="${user.image}" alt="Profile picture of ${user.firstName} ${user.lastName}">
                <h2>${user.firstName} ${user.lastName}</h2>
                <p>Email: ${user.email}</p>
                <p>Address: ${user.address.address}, ${user.address.city}</p>
                <p>Age: ${user.age}</p>
            `;
            profileCard.style.display = "block";
        } else {
            console.error("User not found");
        }
    }
});
