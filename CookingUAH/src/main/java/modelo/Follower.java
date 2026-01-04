package modelo;

/**
 * Representa la relación de seguimiento entre dos usuarios.
 */
public class Follower {
    private int followerId;
    private int followedId;

    public Follower() {}

    public Follower(int followerId, int followedId) {
        this.followerId = followerId;
        this.followedId = followedId;
    }

    // Getters y Setters
    public int getFollowerId() { return followerId; }
    public void setFollowerId(int followerId) { this.followerId = followerId; }

    public int getFollowedId() { return followedId; }
    public void setFollowedId(int followedId) { this.followedId = followedId; }
}