export class BombGameContext {
    constructor(bomb, start_time, start_probablility, probability_increment)
    {
        this.bomb = bomb;
        this.start_time = start_time;
        this.start_probablility = start_probablility;
        this.probability_increment = probability_increment;
    }
}


export class BombGenerator {
    constructor(bomb_contexts)
    {
        this.inactive_contexts = bomb_contexts
        this.active_contexts = []
    }

    rand_by_dist(dist)
    {
        const sum = dist.reduce((sum, a) => sum + a, 0);
        const choice = Math.random() * sum;
        var until_now = 0;
        for (var i = 0; i < dist.length; i++)
        {
            until_now += dist[i];
            if (choice < until_now)
                return i;
        }
        return dist.length - 1;
    }

    get_next(current_time)
    {
        // Wake up relevant contexts
        for (var i = 0; i < this.inactive_contexts.length - 1; i++)
        {
            if (current_time > this.inactive_contexts[i].start_time)
            {
                this.active_contexts.push(this.inactive_contexts[i]);
                array.splice(i, 1);
            }
        }

        // Calculate the probability for each bomb
        var dist_list = [];
        for (var i = 0; i < this.active_contexts.length - 1; i++)
        {
            dist_list.push(bomb_context.start_probablility + (current_time - bomb_context.start_probablility) * bomb_context.probability_increment)
        }

        // Select a bomb from the list based on the probability distribution.
        return this.active_contexts[this.rand_by_dist(dist_list)].bomb;
    }
}