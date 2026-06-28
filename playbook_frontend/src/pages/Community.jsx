import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PlaybookCard from "../components/PlaybookCard";
import PostCard from "../components/PostCard";

import {
  createPost,
  getPosts,
  upvotePost,
} from "../services/api";

import "../styles/community.css";

const attackTypes = [
  "All",
  "Phishing",
  "Ransomware",
  "Malware",
  "DDoS",
  "Data Breach",
];

function Community({
  sharedPlaybook,
}) {
  const [posts, setPosts] =
    useState([]);

  const [title, setTitle] =
    useState(
      sharedPlaybook?.attack_title ||
        ""
    );

  const [attackType, setAttackType] =
    useState(
      inferAttackType(
        sharedPlaybook
      )
    );

  const [content, setContent] =
    useState("");

  const [
    filterAttackType,
    setFilterAttackType,
  ] = useState("All");

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const fetchPosts =
    async () => {
      setIsLoading(true);

      try {
        const response =
          await getPosts();

        setPosts(
          response.data.posts || []
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.detail ||
            "Unable to load posts."
        );
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (sharedPlaybook) {
      setTitle(
        sharedPlaybook.attack_title ||
          ""
      );

      setAttackType(
        inferAttackType(
          sharedPlaybook
        )
      );

      setContent(
        `Severity: ${sharedPlaybook.severity}

${formatPlaybookForPost(
  sharedPlaybook
)}`
      );
    }
  }, [sharedPlaybook]);

  const visiblePosts =
    useMemo(() => {
      return posts
        .filter((post) => {
          if (
            filterAttackType ===
            "All"
          ) {
            return true;
          }

          return (
            post.attack_name ===
            filterAttackType
          );
        })
        .sort(
          (a, b) =>
            b.rating - a.rating
        );
    }, [
      posts,
      filterAttackType,
    ]);

  const getCurrentUser =
    () => {
      const user =
        localStorage.getItem(
          "user"
        );

      return user
        ? JSON.parse(user)
        : null;
    };

  const handleCreatePost =
    async (e) => {
      e.preventDefault();

      const user =
        getCurrentUser();

      setIsSubmitting(true);
      setError("");
      setSuccess("");

      try {
        const response =
          await createPost({
            username:
              user?.username ||
              "Guest User",
            title,
            attack_name:
              attackType,
            content,
            rating: 0,
          });

        setPosts((prev) => [
          response.data.post,
          ...prev,
        ]);

        setTitle("");
        setAttackType(
          "Phishing"
        );
        setContent("");

        setSuccess(
          "Post shared successfully."
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.detail ||
            "Unable to create post."
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleUpvotePost =
    async (id) => {
      try {
        await upvotePost(id);
        await fetchPosts();
      } catch {
        setError(
          "Unable to upvote."
        );
      }
    };

  return (
    <section className="community">
      <div className="community__header">
        <div>
          <p className="community__eyebrow">
            SOC Knowledge Exchange
          </p>

          <h1>Community</h1>
        </div>

        <label className="community__filter">
          Filter by attack type

          <select
            value={
              filterAttackType
            }
            onChange={(e) =>
              setFilterAttackType(
                e.target.value
              )
            }
          >
            {attackTypes.map(
              (type) => (
                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>
              )
            )}
          </select>
        </label>
      </div>

      {sharedPlaybook && (
        <div className="community__shared-playbook">
          <h2>
            Shared Playbook
          </h2>

          <PlaybookCard
            playbook={
              sharedPlaybook
            }
          />
        </div>
      )}

      <form
        className="community__form"
        onSubmit={
          handleCreatePost
        }
      >
        <h2>Create Post</h2>

        <label>
          Title
          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />
        </label>

        <label>
          Attack Type
          <select
            value={attackType}
            onChange={(e) =>
              setAttackType(
                e.target.value
              )
            }
          >
            {attackTypes
              .filter(
                (t) =>
                  t !== "All"
              )
              .map((t) => (
                <option
                  key={t}
                  value={t}
                >
                  {t}
                </option>
              ))}
          </select>
        </label>

        <label>
          Content
          <textarea
            rows={6}
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
          />
        </label>

        <button
          disabled={
            isSubmitting
          }
        >
          {isSubmitting
            ? "Sharing..."
            : "Create Post"}
        </button>
      </form>

      {error && (
        <p className="community__error">
          {error}
        </p>
      )}

      {success && (
        <p className="community__success">
          {success}
        </p>
      )}

      {isLoading && (
        <p className="community__status">
          Loading Posts...
        </p>
      )}

      <div className="community__grid">
        {visiblePosts.map(
          (post) => (
            <PostCard
              key={post._id}
              post={post}
              onUpvote={
                handleUpvotePost
              }
            />
          )
        )}
      </div>
    </section>
  );
}

function formatPlaybookForPost(
  playbook
) {
  return `
Detection:
${playbook.detection || ""}

Containment:
${playbook.containment || ""}

Eradication:
${playbook.eradication || ""}
`;
}

function inferAttackType(
  playbook
) {
  const title =
    playbook?.attack_title || "";

  const found =
    attackTypes.find(
      (t) =>
        t !== "All" &&
        title.includes(t)
    );

  return found || "Phishing";
}

export default Community;